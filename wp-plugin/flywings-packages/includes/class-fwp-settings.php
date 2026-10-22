<?php
/**
 * Packages > Settings: where the website lives, the shared secret used to
 * refresh it, and the defaults that pre-fill every new package.
 */

defined( 'ABSPATH' ) || exit;

class FWP_Settings {

	const OPTION    = 'fwp_settings';
	const PING_LOG  = 'fwp_last_ping';
	const PAGE_SLUG = 'fwp-settings';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
		add_action( 'admin_post_fwp_test_connection', array( __CLASS__, 'test_connection' ) );
	}

	public static function defaults() {
		return array(
			// The www host is the website's primary address; the bare domain redirects to it.
			'site_url'          => 'https://www.flywingstour.co.in',
			'secret'            => '',
			'default_policy'    => implode(
				"\n",
				array(
					'Free cancellation up to 30 days before departure - full refund',
					'15-29 days before departure: 25% cancellation fee applies',
					'7-14 days before departure: 50% cancellation fee applies',
					'Less than 7 days before departure or no-show: 100% cancellation fee',
					'Visa rejection: visa fee is non-refundable, the rest of the payment is refunded in full',
				)
			),
			'default_faqs'      => implode(
				"\n",
				array(
					'Can I customize this package? | Yes. We can change hotels, add or remove days, add activities or build a fully custom plan. Tell us what you need and our team will send a revised quote.',
					'Is the price per person? | Yes. Prices are per person on twin sharing unless stated otherwise. Solo, triple sharing and child prices are available on request.',
					'How do I book this package? | Click Enquire Now or message us on WhatsApp at +91 99143 10333. Our travel expert will confirm availability, share the final quote and guide you through payment.',
				)
			),
			'inclusion_presets' => implode(
				"\n",
				array(
					'Return economy flights',
					'Hotel accommodation on twin sharing',
					'Daily breakfast',
					'Airport transfers in a private vehicle',
					'Sightseeing as per itinerary',
					'Tourist visa fees and processing',
					'Travel insurance',
					'All applicable hotel taxes',
					'24/7 Flywings travel support',
				)
			),
			'exclusion_presets' => implode(
				"\n",
				array(
					'GST 5% and TCS as applicable',
					'Flights unless mentioned',
					'Lunch and dinner unless mentioned',
					'Personal expenses such as shopping, laundry and phone calls',
					'Tips for guides and drivers',
					'Optional tours and activities',
					'Travel insurance',
					'Early check-in or late checkout',
					'Anything not listed under inclusions',
				)
			),
		);
	}

	public static function all() {
		$saved = get_option( self::OPTION, array() );
		return wp_parse_args( is_array( $saved ) ? $saved : array(), self::defaults() );
	}

	public static function get( $key ) {
		$all = self::all();
		return isset( $all[ $key ] ) ? $all[ $key ] : '';
	}

	/** Website base URL without a trailing slash, e.g. https://flywingstour.co.in */
	public static function site_url() {
		return untrailingslashit( esc_url_raw( (string) self::get( 'site_url' ) ) );
	}

	/**
	 * The /api/revalidate secret. A FWP_REVALIDATE_SECRET constant in
	 * wp-config.php wins over the settings field, so the secret can be
	 * kept out of the database.
	 */
	public static function secret() {
		if ( defined( 'FWP_REVALIDATE_SECRET' ) && FWP_REVALIDATE_SECRET ) {
			return (string) FWP_REVALIDATE_SECRET;
		}
		return (string) self::get( 'secret' );
	}

	/** One entry per non-empty line of a textarea setting. */
	public static function lines( $key ) {
		$lines = preg_split( '/\r\n|\r|\n/', (string) self::get( $key ) );
		return array_values( array_filter( array_map( 'trim', $lines ), 'strlen' ) );
	}

	/** "Question | Answer" lines as FAQ pairs. */
	public static function default_faqs() {
		$faqs = array();
		foreach ( self::lines( 'default_faqs' ) as $line ) {
			$parts = array_map( 'trim', explode( '|', $line, 2 ) );
			if ( '' !== $parts[0] ) {
				$faqs[] = array(
					'question' => $parts[0],
					'answer'   => isset( $parts[1] ) ? $parts[1] : '',
				);
			}
		}
		return $faqs;
	}

	/**
	 * Signs a draft preview link. Checked by WordPress itself when the
	 * website asks for the draft, so it uses WordPress's own salt and works
	 * even before the revalidate secret is set up.
	 */
	public static function preview_token( $post_id, $expires ) {
		return hash_hmac( 'sha256', 'fwp-preview|' . (int) $post_id . '|' . (int) $expires, wp_salt( 'auth' ) );
	}

	public static function preview_url( $post_id ) {
		$expires = time() + DAY_IN_SECONDS;
		return self::site_url() . '/packages/preview/' . (int) $post_id . '?exp=' . $expires . '&token=' . self::preview_token( $post_id, $expires );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=' . FWP_Data::POST_TYPE,
			__( 'Package Settings', 'flywings-packages' ),
			__( 'Settings', 'flywings-packages' ),
			'manage_options',
			self::PAGE_SLUG,
			array( __CLASS__, 'render' )
		);
	}

	public static function register() {
		register_setting(
			'fwp_settings_group',
			self::OPTION,
			array( 'sanitize_callback' => array( __CLASS__, 'sanitize' ) )
		);
	}

	public static function sanitize( $input ) {
		$input = is_array( $input ) ? $input : array();
		$old   = self::all();
		$out   = array();

		$out['site_url'] = isset( $input['site_url'] ) ? untrailingslashit( esc_url_raw( trim( $input['site_url'] ) ) ) : $old['site_url'];
		if ( '' === $out['site_url'] ) {
			$out['site_url'] = self::defaults()['site_url'];
		}

		// A blank password box means "keep the current secret".
		$secret        = isset( $input['secret'] ) ? trim( (string) $input['secret'] ) : '';
		$out['secret'] = '' !== $secret ? sanitize_text_field( $secret ) : $old['secret'];
		if ( ! empty( $input['clear_secret'] ) ) {
			$out['secret'] = '';
		}

		foreach ( array( 'default_policy', 'default_faqs', 'inclusion_presets', 'exclusion_presets' ) as $key ) {
			$out[ $key ] = isset( $input[ $key ] ) ? sanitize_textarea_field( $input[ $key ] ) : $old[ $key ];
		}
		return $out;
	}

	/**
	 * Calls the website's refresh endpoint once and reports what happened,
	 * so a wrong URL or secret shows up here instead of as packages that
	 * silently never update.
	 */
	public static function test_connection() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'flywings-packages' ) );
		}
		check_admin_referer( 'fwp_test_connection' );
		FWP_Sync::ping( true );
		wp_safe_redirect( admin_url( 'edit.php?post_type=' . FWP_Data::POST_TYPE . '&page=' . self::PAGE_SLUG . '&tested=1' ) );
		exit;
	}

	/** Human summary of the last refresh call, or '' if none yet. */
	public static function last_ping_summary() {
		$log = get_option( self::PING_LOG );
		if ( ! is_array( $log ) || empty( $log['time'] ) ) {
			return array(
				'ok'   => null,
				'text' => '',
			);
		}
		$when = sprintf(
			/* translators: %s: time difference, e.g. "5 mins" */
			__( '%s ago', 'flywings-packages' ),
			human_time_diff( (int) $log['time'], time() )
		);
		return array(
			'ok'   => ! empty( $log['ok'] ),
			'text' => ! empty( $log['ok'] )
				? sprintf( __( 'Website refreshed %s.', 'flywings-packages' ), $when )
				: sprintf( __( 'Website refresh failed %1$s: %2$s', 'flywings-packages' ), $when, $log['message'] ),
		);
	}

	public static function render() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$s        = self::all();
		$ping     = self::last_ping_summary();
		$has_const = defined( 'FWP_REVALIDATE_SECRET' ) && FWP_REVALIDATE_SECRET;
		?>
		<div class="wrap fwp-settings">
			<h1><?php esc_html_e( 'Package Settings', 'flywings-packages' ); ?></h1>

			<?php if ( isset( $_GET['tested'] ) && '' !== $ping['text'] ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
				<div class="notice notice-<?php echo $ping['ok'] ? 'success' : 'error'; ?> is-dismissible"><p><?php echo esc_html( $ping['text'] ); ?></p></div>
			<?php endif; ?>

			<form method="post" action="options.php">
				<?php settings_fields( 'fwp_settings_group' ); ?>

				<h2 class="title"><?php esc_html_e( 'Website connection', 'flywings-packages' ); ?></h2>
				<p class="description"><?php esc_html_e( 'When a package is published, edited or removed, WordPress tells the website to refresh so the change is live within seconds.', 'flywings-packages' ); ?></p>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="fwp-site-url"><?php esc_html_e( 'Website address', 'flywings-packages' ); ?></label></th>
						<td><input type="url" id="fwp-site-url" class="regular-text" name="<?php echo esc_attr( self::OPTION ); ?>[site_url]" value="<?php echo esc_attr( $s['site_url'] ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="fwp-secret"><?php esc_html_e( 'Refresh secret', 'flywings-packages' ); ?></label></th>
						<td>
							<?php if ( $has_const ) : ?>
								<p><?php esc_html_e( 'Set in wp-config.php (FWP_REVALIDATE_SECRET).', 'flywings-packages' ); ?></p>
							<?php else : ?>
								<input type="password" id="fwp-secret" class="regular-text" autocomplete="new-password" name="<?php echo esc_attr( self::OPTION ); ?>[secret]" value="" placeholder="<?php echo $s['secret'] ? esc_attr__( 'Saved. Type a new one to replace it.', 'flywings-packages' ) : ''; ?>" />
								<p class="description"><?php esc_html_e( 'Same value as REVALIDATE_SECRET in the website\'s Vercel settings.', 'flywings-packages' ); ?></p>
								<?php if ( $s['secret'] ) : ?>
									<label><input type="checkbox" name="<?php echo esc_attr( self::OPTION ); ?>[clear_secret]" value="1" /> <?php esc_html_e( 'Remove the saved secret', 'flywings-packages' ); ?></label>
								<?php endif; ?>
							<?php endif; ?>
						</td>
					</tr>
				</table>

				<h2 class="title"><?php esc_html_e( 'Defaults for new packages', 'flywings-packages' ); ?></h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="fwp-policy"><?php esc_html_e( 'Cancellation policy', 'flywings-packages' ); ?></label></th>
						<td><textarea id="fwp-policy" class="large-text" rows="6" name="<?php echo esc_attr( self::OPTION ); ?>[default_policy]"><?php echo esc_textarea( $s['default_policy'] ); ?></textarea>
						<p class="description"><?php esc_html_e( 'One rule per line. Filled into every new package, and can be changed per package.', 'flywings-packages' ); ?></p></td>
					</tr>
					<tr>
						<th scope="row"><label for="fwp-faqs"><?php esc_html_e( 'Standard FAQs', 'flywings-packages' ); ?></label></th>
						<td><textarea id="fwp-faqs" class="large-text" rows="6" name="<?php echo esc_attr( self::OPTION ); ?>[default_faqs]"><?php echo esc_textarea( $s['default_faqs'] ); ?></textarea>
						<p class="description"><?php esc_html_e( 'One FAQ per line, written as: Question | Answer', 'flywings-packages' ); ?></p></td>
					</tr>
					<tr>
						<th scope="row"><label for="fwp-inc"><?php esc_html_e( 'Quick inclusions', 'flywings-packages' ); ?></label></th>
						<td><textarea id="fwp-inc" class="large-text" rows="6" name="<?php echo esc_attr( self::OPTION ); ?>[inclusion_presets]"><?php echo esc_textarea( $s['inclusion_presets'] ); ?></textarea>
						<p class="description"><?php esc_html_e( 'One per line. Shown as one-click buttons on the Inclusions tab.', 'flywings-packages' ); ?></p></td>
					</tr>
					<tr>
						<th scope="row"><label for="fwp-exc"><?php esc_html_e( 'Quick exclusions', 'flywings-packages' ); ?></label></th>
						<td><textarea id="fwp-exc" class="large-text" rows="6" name="<?php echo esc_attr( self::OPTION ); ?>[exclusion_presets]"><?php echo esc_textarea( $s['exclusion_presets'] ); ?></textarea></td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>

			<hr />
			<h2 class="title"><?php esc_html_e( 'Check the connection', 'flywings-packages' ); ?></h2>
			<?php if ( '' !== $ping['text'] ) : ?>
				<p><?php echo esc_html( $ping['text'] ); ?></p>
			<?php endif; ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="fwp_test_connection" />
				<?php wp_nonce_field( 'fwp_test_connection' ); ?>
				<?php submit_button( __( 'Refresh the website now', 'flywings-packages' ), 'secondary', 'submit', false ); ?>
			</form>
		</div>
		<?php
	}
}
