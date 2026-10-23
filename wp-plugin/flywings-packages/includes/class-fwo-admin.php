<?php
/**
 * The offer edit screen.
 *
 * Works exactly as the package screen does: WordPress's own post editor
 * (title, Publish box, revisions, edit lock) with one "Offer details"
 * box holding the editor app from assets/offer-admin.js. The app keeps
 * the whole offer as JSON in a hidden field, so a normal Save Draft /
 * Publish / Update stores it.
 *
 * Saving is guarded the same way: an offer missing something the
 * website needs is held back as a draft, and an edit that would break a
 * live offer is not saved at all (the live card stays as it was, and
 * the editor reopens with the edits so nothing typed is lost).
 */

defined( 'ABSPATH' ) || exit;

class FWO_Admin {

	const NONCE_ACTION = 'fwo_save';
	const NONCE_FIELD  = 'fwo_nonce';

	/** post_id => errors, for live offers whose edit was refused in this request. */
	private static $refused = array();

	private static $config = null;

	public static function init() {
		add_action( 'add_meta_boxes_' . FWO_Data::POST_TYPE, array( __CLASS__, 'meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_filter( 'wp_insert_post_data', array( __CLASS__, 'filter_post_data' ), 99, 2 );
		add_action( 'save_post_' . FWO_Data::POST_TYPE, array( __CLASS__, 'save' ), 10, 2 );
		add_filter( 'redirect_post_location', array( __CLASS__, 'redirect_location' ), 10, 2 );
		add_action( 'admin_notices', array( __CLASS__, 'notices' ) );
		add_filter( 'admin_body_class', array( __CLASS__, 'body_class' ) );
	}

	/* ─── Screen ─────────────────────────────────────────────────────────── */

	public static function meta_boxes( $post ) {
		remove_meta_box( 'slugdiv', FWO_Data::POST_TYPE, 'normal' );
		add_meta_box( 'fwo-editor', __( 'Offer details', 'flywings-packages' ), array( __CLASS__, 'render_editor' ), FWO_Data::POST_TYPE, 'normal', 'high' );
		add_meta_box( 'fwo-sidebar', __( 'How it looks on the website', 'flywings-packages' ), array( __CLASS__, 'render_sidebar' ), FWO_Data::POST_TYPE, 'side', 'default' );
	}

	public static function render_editor( $post ) {
		$config = self::config( $post );
		wp_nonce_field( self::NONCE_ACTION, self::NONCE_FIELD );
		// Pre-filled with the saved offer, so a save without JavaScript keeps it intact.
		printf( '<input type="hidden" id="fwo-data-input" name="fwo_data" value="%s" />', esc_attr( wp_json_encode( $config['data'] ) ) );
		echo '<div id="fwo-app" class="fwp-app"><p class="fwp-loading">' . esc_html__( 'Loading the offer editor...', 'flywings-packages' ) . '</p></div>';
	}

	public static function render_sidebar() {
		echo '<div id="fwo-sidebar-root"></div>';
	}

	public static function body_class( $classes ) {
		$screen = get_current_screen();
		if ( $screen && FWO_Data::POST_TYPE === $screen->post_type ) {
			$classes .= ' fwp-screen';
		}
		return $classes;
	}

	public static function enqueue( $hook ) {
		$screen = get_current_screen();
		if ( ! $screen || FWO_Data::POST_TYPE !== $screen->post_type ) {
			return;
		}
		// The same stylesheet as the package editor: one look for both.
		wp_enqueue_style( 'fwp-admin', FWP_URL . 'assets/admin.css', array( 'wp-components' ), self::asset_version( 'assets/admin.css' ) );
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}
		$post = get_post();
		if ( ! $post ) {
			return;
		}
		wp_enqueue_media( array( 'post' => $post->ID ) );
		wp_enqueue_script( 'fwo-admin', FWP_URL . 'assets/offer-admin.js', array( 'wp-element', 'wp-components', 'jquery' ), self::asset_version( 'assets/offer-admin.js' ), true );
		wp_add_inline_script( 'fwo-admin', 'window.fwoAdmin = ' . wp_json_encode( self::config( $post ) ) . ';', 'before' );
	}

	private static function asset_version( $file ) {
		$path = FWP_DIR . $file;
		return file_exists( $path ) ? FWP_VERSION . '.' . filemtime( $path ) : FWP_VERSION;
	}

	private static function refused_key( $post_id ) {
		return 'fwo_refused_' . (int) $post_id . '_' . get_current_user_id();
	}

	private static function flash_key() {
		return 'fwo_flash_' . get_current_user_id();
	}

	/** Everything the editor app starts with. Built once per request. */
	public static function config( $post ) {
		if ( null !== self::$config ) {
			return self::$config;
		}
		$is_new = 'auto-draft' === $post->post_status;
		$data   = $is_new ? FWO_Data::new_offer_defaults() : FWO_Data::get( $post->ID );
		$slug   = $is_new ? '' : $post->post_name;

		// A refused edit to a live offer comes back so nothing typed is lost.
		$refused = get_transient( self::refused_key( $post->ID ) );
		if ( is_array( $refused ) && isset( $refused['data'] ) ) {
			delete_transient( self::refused_key( $post->ID ) );
			$data = FWO_Data::merge( $refused['data'] );
			$slug = isset( $refused['slug'] ) ? $refused['slug'] : $slug;
		} else {
			$refused = null;
		}
		$data['slug'] = $slug;

		self::$config = array(
			'data'              => $data,
			'isNew'             => $is_new,
			'offersUrl'         => rtrim( FWP_Settings::site_url(), '/' ) . '/offers',
			'inclusionPresets'  => FWP_Settings::lines( 'inclusion_presets' ),
			'packages'          => self::package_choices(),
			'ping'              => FWP_Settings::last_ping_summary(),
			'secretSet'         => '' !== FWP_Settings::secret(),
			'duplicateUrl'      => $is_new ? '' : FWO_Post_Type::duplicate_url( $post->ID ),
			'refused'           => $refused ? $refused['errors'] : null,
		);
		return self::$config;
	}

	/**
	 * Published packages, for the "compared with" picker.
	 *
	 * Letting the editor pick from a list rather than type a URL is what
	 * keeps the comparison link pointing at a page that exists.
	 */
	private static function package_choices() {
		$posts = get_posts(
			array(
				'post_type'        => FWP_Data::POST_TYPE,
				'post_status'      => 'publish',
				'posts_per_page'   => 200,
				'orderby'          => 'title',
				'order'            => 'ASC',
				'no_found_rows'    => true,
				'suppress_filters' => true,
			)
		);
		$out = array();
		foreach ( $posts as $p ) {
			$d     = FWP_Data::get( $p->ID );
			$out[] = array(
				'slug'  => $p->post_name,
				'label' => '' !== $d['shortTitle'] ? $d['shortTitle'] : html_entity_decode( get_the_title( $p ), ENT_QUOTES, 'UTF-8' ),
				'href'  => '/packages/' . $p->post_name,
				'price' => (int) $d['startingPrice'],
			);
		}
		return $out;
	}

	/* ─── Saving ─────────────────────────────────────────────────────────── */

	/** The offer JSON from the edit form, or null when this request is not our form. */
	private static function posted( $post_id ) {
		if ( ! isset( $_POST[ self::NONCE_FIELD ], $_POST['fwo_data'], $_POST['post_ID'] ) ) {
			return null;
		}
		if ( ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST[ self::NONCE_FIELD ] ) ), self::NONCE_ACTION ) ) {
			return null;
		}
		if ( (int) $_POST['post_ID'] !== (int) $post_id ) {
			return null;
		}
		$raw = json_decode( wp_unslash( $_POST['fwo_data'] ), true ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized by FWO_Data::sanitize().
		return is_array( $raw ) ? $raw : null;
	}

	/**
	 * Sets the anchor slug from the editor and applies the publish
	 * guard, before WordPress writes the post row.
	 */
	public static function filter_post_data( $data, $postarr ) {
		if ( FWO_Data::POST_TYPE !== $data['post_type'] || in_array( $data['post_status'], array( 'auto-draft', 'inherit', 'trash' ), true ) ) {
			return $data;
		}
		$id  = isset( $postarr['ID'] ) ? (int) $postarr['ID'] : 0;
		$raw = self::posted( $id );
		if ( null === $raw ) {
			return $data;
		}

		$title = wp_unslash( $data['post_title'] );
		$slug  = sanitize_title( isset( $raw['slug'] ) ? (string) $raw['slug'] : '' );
		if ( '' === $slug ) {
			$slug = sanitize_title( $title );
		}
		if ( '' !== $slug ) {
			$data['post_name'] = wp_unique_post_slug( $slug, $id, $data['post_status'], FWO_Data::POST_TYPE, 0 );
		}

		if ( ! in_array( $data['post_status'], array( 'publish', 'future' ), true ) ) {
			return $data;
		}
		$errors = FWO_Data::publish_errors( FWO_Data::sanitize( $raw ), $title );
		if ( ! $errors ) {
			return $data;
		}

		$old = $id ? get_post( $id ) : null;
		if ( $old && in_array( $old->post_status, array( 'publish', 'future' ), true ) ) {
			// Live offer: keep the live version exactly as it is.
			self::$refused[ $id ] = $errors;
			$data['post_title']   = wp_slash( $old->post_title );
			$data['post_name']    = $old->post_name;
			$data['post_status']  = $old->post_status;
			self::flash( $id, 'refused', $errors );
		} else {
			$data['post_status'] = 'draft';
			self::flash( $id, 'held', $errors );
		}
		return $data;
	}

	public static function save( $post_id, $post ) {
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		$raw = self::posted( $post_id );
		if ( null === $raw || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$clean = FWO_Data::sanitize( $raw );

		if ( isset( self::$refused[ $post_id ] ) ) {
			set_transient(
				self::refused_key( $post_id ),
				array(
					'data'   => $clean,
					'slug'   => sanitize_title( isset( $raw['slug'] ) ? (string) $raw['slug'] : '' ),
					'errors' => self::$refused[ $post_id ],
				),
				HOUR_IN_SECONDS
			);
			return;
		}

		update_post_meta( $post_id, FWO_Data::META, wp_slash( $clean ) );
	}

	private static function flash( $post_id, $type, array $errors ) {
		set_transient(
			self::flash_key(),
			array(
				'post'   => (int) $post_id,
				'type'   => $type,
				'errors' => $errors,
			),
			5 * MINUTE_IN_SECONDS
		);
	}

	/** Drops WordPress's "Offer published/updated" message when the save was held back. */
	public static function redirect_location( $location, $post_id ) {
		if ( FWO_Data::POST_TYPE !== get_post_type( $post_id ) ) {
			return $location;
		}
		$flash = get_transient( self::flash_key() );
		if ( is_array( $flash ) && (int) $flash['post'] === (int) $post_id ) {
			$location = remove_query_arg( 'message', $location );
		}
		return $location;
	}

	public static function notices() {
		$screen = get_current_screen();
		if ( ! $screen || FWO_Data::POST_TYPE !== $screen->post_type || 'post' !== $screen->base ) {
			return;
		}
		$flash = get_transient( self::flash_key() );
		if ( ! is_array( $flash ) || empty( $flash['errors'] ) ) {
			return;
		}
		delete_transient( self::flash_key() );

		$refused = 'refused' === $flash['type'];
		$heading = $refused
			? __( 'Not saved. The live offer on the website is unchanged.', 'flywings-packages' )
			: __( 'Saved as a draft instead of publishing, because of this:', 'flywings-packages' );

		echo '<div class="notice notice-error"><p><strong>' . esc_html( $heading ) . '</strong></p><ul style="list-style:disc;margin-left:20px">';
		foreach ( $flash['errors'] as $error ) {
			echo '<li>' . esc_html( $error['message'] ) . '</li>';
		}
		echo '</ul>';
		if ( $refused ) {
			echo '<p>' . esc_html__( 'Your edits are still in the form below. Fix the points above and publish again.', 'flywings-packages' ) . '</p>';
		}
		echo '</div>';
	}
}
