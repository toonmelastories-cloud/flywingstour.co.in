<?php
/**
 * The "Packages" menu: the package post type, the Destination and Trip
 * type lists, and the package list screen (columns, filter, Duplicate).
 */

defined( 'ABSPATH' ) || exit;

class FWP_Post_Type {

	/** Destination pages that already exist on the website, with their region. */
	const SEED_DESTINATIONS = array(
		'dubai'         => array( 'Dubai', 'international' ),
		'thailand'      => array( 'Thailand', 'international' ),
		'bali'          => array( 'Bali', 'international' ),
		'maldives'      => array( 'Maldives', 'international' ),
		'singapore'     => array( 'Singapore', 'international' ),
		'malaysia'      => array( 'Malaysia', 'international' ),
		'almaty'        => array( 'Almaty', 'international' ),
		'kashmir'       => array( 'Kashmir', 'india' ),
		'manali'        => array( 'Manali', 'india' ),
		'shimla-manali' => array( 'Shimla & Manali', 'india' ),
		'goa'           => array( 'Goa', 'india' ),
		'spiti-valley'  => array( 'Spiti Valley', 'india' ),
	);

	const SEED_TRIP_TYPES = array( 'Honeymoon', 'Family', 'Friends', 'Luxury', 'Budget', 'Adventure', 'Senior Citizen', 'Group' );

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
		add_action( 'init', array( __CLASS__, 'maybe_seed' ), 20 );

		add_action( FWP_Data::TAX_DEST . '_add_form_fields', array( __CLASS__, 'region_field_add' ) );
		add_action( FWP_Data::TAX_DEST . '_edit_form_fields', array( __CLASS__, 'region_field_edit' ) );
		add_action( 'created_' . FWP_Data::TAX_DEST, array( __CLASS__, 'save_region' ) );
		add_action( 'edited_' . FWP_Data::TAX_DEST, array( __CLASS__, 'save_region' ) );
		add_filter( 'manage_edit-' . FWP_Data::TAX_DEST . '_columns', array( __CLASS__, 'region_column' ) );
		add_filter( 'manage_' . FWP_Data::TAX_DEST . '_custom_column', array( __CLASS__, 'region_column_value' ), 10, 3 );

		add_filter( 'manage_' . FWP_Data::POST_TYPE . '_posts_columns', array( __CLASS__, 'columns' ) );
		add_action( 'manage_' . FWP_Data::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'column_value' ), 10, 2 );
		add_action( 'restrict_manage_posts', array( __CLASS__, 'destination_filter' ) );
		add_action( 'pre_get_posts', array( __CLASS__, 'apply_destination_filter' ) );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_post_fwp_duplicate', array( __CLASS__, 'duplicate' ) );
		add_filter( 'post_updated_messages', array( __CLASS__, 'messages' ) );
		add_filter( 'enter_title_here', array( __CLASS__, 'title_placeholder' ), 10, 2 );
	}

	public static function register() {
		register_post_type(
			FWP_Data::POST_TYPE,
			array(
				'labels'              => array(
					'name'               => __( 'Packages', 'flywings-packages' ),
					'singular_name'      => __( 'Package', 'flywings-packages' ),
					'menu_name'          => __( 'Packages', 'flywings-packages' ),
					'all_items'          => __( 'All Packages', 'flywings-packages' ),
					'add_new'            => __( 'Add Package', 'flywings-packages' ),
					'add_new_item'       => __( 'Add New Package', 'flywings-packages' ),
					'edit_item'          => __( 'Edit Package', 'flywings-packages' ),
					'new_item'           => __( 'New Package', 'flywings-packages' ),
					'search_items'       => __( 'Search Packages', 'flywings-packages' ),
					'not_found'          => __( 'No packages yet. Click "Add Package" to create the first one.', 'flywings-packages' ),
					'not_found_in_trash' => __( 'No packages in the trash.', 'flywings-packages' ),
				),
				// The website renders packages; WordPress only stores them.
				'public'              => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_admin_bar'   => true,
				'show_in_rest'        => false,
				'menu_position'       => 21,
				'menu_icon'           => 'dashicons-airplane',
				'supports'            => array( 'title', 'revisions', 'author' ),
				// Editors and administrators manage packages; authors and contributors do not.
				'capability_type'     => 'page',
				'map_meta_cap'        => true,
				'hierarchical'        => false,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'exclude_from_search' => true,
			)
		);

		$tax_common = array(
			'public'            => false,
			'show_ui'           => true,
			'show_in_menu'      => true,
			'show_in_rest'      => false,
			'show_admin_column' => false,
			'show_tagcloud'     => false,
			'hierarchical'      => false,
			'rewrite'           => false,
			'query_var'         => false,
			// The package editor has its own pickers for these.
			'meta_box_cb'       => false,
			'capabilities'      => array(
				'manage_terms' => 'edit_pages',
				'edit_terms'   => 'edit_pages',
				'delete_terms' => 'edit_pages',
				'assign_terms' => 'edit_pages',
			),
		);

		register_taxonomy(
			FWP_Data::TAX_DEST,
			FWP_Data::POST_TYPE,
			array_merge(
				$tax_common,
				array(
					'labels' => array(
						'name'          => __( 'Destinations', 'flywings-packages' ),
						'singular_name' => __( 'Destination', 'flywings-packages' ),
						'add_new_item'  => __( 'Add New Destination', 'flywings-packages' ),
						'edit_item'     => __( 'Edit Destination', 'flywings-packages' ),
						'search_items'  => __( 'Search Destinations', 'flywings-packages' ),
						'not_found'     => __( 'No destinations yet.', 'flywings-packages' ),
					),
				)
			)
		);

		register_taxonomy(
			FWP_Data::TAX_TYPE,
			FWP_Data::POST_TYPE,
			array_merge(
				$tax_common,
				array(
					'labels' => array(
						'name'          => __( 'Trip Types', 'flywings-packages' ),
						'singular_name' => __( 'Trip Type', 'flywings-packages' ),
						'add_new_item'  => __( 'Add New Trip Type', 'flywings-packages' ),
						'edit_item'     => __( 'Edit Trip Type', 'flywings-packages' ),
						'search_items'  => __( 'Search Trip Types', 'flywings-packages' ),
						'not_found'     => __( 'No trip types yet.', 'flywings-packages' ),
					),
				)
			)
		);

		register_post_meta(
			FWP_Data::POST_TYPE,
			FWP_Data::META,
			array(
				'type'              => 'object',
				'single'            => true,
				'show_in_rest'      => false,
				// Restoring a revision brings back the whole package, not just the title.
				'revisions_enabled' => true,
			)
		);
	}

	public static function activate() {
		self::register();
		self::seed();
		flush_rewrite_rules();
	}

	/** Seeds once, also for installs where the activation hook did not run. */
	public static function maybe_seed() {
		if ( ! get_option( 'fwp_seeded' ) ) {
			self::seed();
		}
	}

	public static function seed() {
		foreach ( self::SEED_DESTINATIONS as $slug => $info ) {
			if ( ! term_exists( $slug, FWP_Data::TAX_DEST ) ) {
				$term = wp_insert_term( $info[0], FWP_Data::TAX_DEST, array( 'slug' => $slug ) );
				if ( ! is_wp_error( $term ) ) {
					update_term_meta( $term['term_id'], FWP_Data::REGION_META, $info[1] );
				}
			}
		}
		foreach ( self::SEED_TRIP_TYPES as $name ) {
			if ( ! term_exists( sanitize_title( $name ), FWP_Data::TAX_TYPE ) ) {
				wp_insert_term( $name, FWP_Data::TAX_TYPE );
			}
		}
		update_option( 'fwp_seeded', 1, false );
	}

	/* ─── Destination region (India / International) ─────────────────────── */

	public static function region_field_add() {
		?>
		<div class="form-field">
			<label for="fwp-region"><?php esc_html_e( 'Region', 'flywings-packages' ); ?></label>
			<select name="fwp_region" id="fwp-region">
				<option value="international"><?php esc_html_e( 'International', 'flywings-packages' ); ?></option>
				<option value="india"><?php esc_html_e( 'India', 'flywings-packages' ); ?></option>
			</select>
			<p><?php esc_html_e( 'Decides whether its packages show on the India or the International tours page.', 'flywings-packages' ); ?></p>
		</div>
		<?php
	}

	public static function region_field_edit( $term ) {
		$region = get_term_meta( $term->term_id, FWP_Data::REGION_META, true );
		?>
		<tr class="form-field">
			<th scope="row"><label for="fwp-region"><?php esc_html_e( 'Region', 'flywings-packages' ); ?></label></th>
			<td>
				<select name="fwp_region" id="fwp-region">
					<option value="international" <?php selected( $region, 'international' ); ?>><?php esc_html_e( 'International', 'flywings-packages' ); ?></option>
					<option value="india" <?php selected( $region, 'india' ); ?>><?php esc_html_e( 'India', 'flywings-packages' ); ?></option>
				</select>
			</td>
		</tr>
		<?php
	}

	public static function save_region( $term_id ) {
		// Core verified the term form's nonce before firing created_/edited_ hooks.
		if ( isset( $_POST['fwp_region'] ) && current_user_can( 'edit_pages' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			$region = 'india' === $_POST['fwp_region'] ? 'india' : 'international'; // phpcs:ignore WordPress.Security.NonceVerification.Missing
			update_term_meta( $term_id, FWP_Data::REGION_META, $region );
		}
	}

	public static function region_column( $columns ) {
		$columns['fwp_region'] = __( 'Region', 'flywings-packages' );
		return $columns;
	}

	public static function region_column_value( $value, $column, $term_id ) {
		if ( 'fwp_region' === $column ) {
			return 'india' === get_term_meta( $term_id, FWP_Data::REGION_META, true ) ? esc_html__( 'India', 'flywings-packages' ) : esc_html__( 'International', 'flywings-packages' );
		}
		return $value;
	}

	/* ─── Package list screen ────────────────────────────────────────────── */

	public static function columns( $columns ) {
		$out = array();
		foreach ( $columns as $key => $label ) {
			if ( 'title' === $key ) {
				$out['fwp_thumb'] = '<span class="screen-reader-text">' . esc_html__( 'Photo', 'flywings-packages' ) . '</span>';
			}
			if ( 'date' === $key ) {
				$out['fwp_destination'] = __( 'Destination', 'flywings-packages' );
				$out['fwp_duration']    = __( 'Duration', 'flywings-packages' );
				$out['fwp_price']       = __( 'Price', 'flywings-packages' );
				$out['fwp_flags']       = __( 'On the website', 'flywings-packages' );
			}
			if ( 'author' === $key ) {
				continue;
			}
			$out[ $key ] = $label;
		}
		return $out;
	}

	public static function column_value( $column, $post_id ) {
		$d = FWP_Data::get( $post_id );
		switch ( $column ) {
			case 'fwp_thumb':
				if ( $d['images'] ) {
					$img = $d['images'][0];
					$src = $img['id'] ? wp_get_attachment_image_url( $img['id'], 'thumbnail' ) : '';
					printf( '<img src="%s" alt="" class="fwp-list-thumb" />', esc_url( $src ? $src : ( $img['thumb'] ? $img['thumb'] : $img['url'] ) ) );
				} else {
					echo '<span class="fwp-list-thumb fwp-list-thumb--empty dashicons dashicons-format-image"></span>';
				}
				break;
			case 'fwp_destination':
				$term = $d['destination'] ? get_term_by( 'slug', $d['destination'], FWP_Data::TAX_DEST ) : false;
				echo $term ? esc_html( FWP_Data::term_name( $term ) ) : '<span aria-hidden="true">-</span>';
				break;
			case 'fwp_duration':
				$label = FWP_Data::duration_label( $d['nights'] );
				echo $label ? esc_html( $label ) : '<span aria-hidden="true">-</span>';
				break;
			case 'fwp_price':
				if ( $d['priceOnRequest'] ) {
					esc_html_e( 'On request', 'flywings-packages' );
				} else {
					$price = FWP_Data::inr( $d['startingPrice'] );
					echo $price ? esc_html( $price ) : '<span aria-hidden="true">-</span>';
					if ( $price && ! $d['showPrice'] ) {
						echo '<br /><small>' . esc_html__( 'hidden on website', 'flywings-packages' ) . '</small>';
					}
				}
				break;
			case 'fwp_flags':
				$flags = array();
				if ( 'publish' === get_post_status( $post_id ) ) {
					$flags[] = FWP_Data::is_listed( $d ) ? array( 'live', __( 'Listed', 'flywings-packages' ) ) : array( 'muted', __( 'Private link', 'flywings-packages' ) );
				}
				if ( $d['featured'] ) {
					$flags[] = array( 'gold', __( 'Homepage', 'flywings-packages' ) );
				}
				if ( FWP_Data::offer_is_live( $d ) ) {
					// The website only shows offers of listed packages that are not sold out.
					$flags[] = FWP_Data::is_listed( $d ) && ! $d['soldOut']
						? array( 'gold', __( 'On offer', 'flywings-packages' ) )
						: array( 'muted', __( 'Offer hidden', 'flywings-packages' ) );
				}
				if ( $d['soldOut'] ) {
					$flags[] = array( 'red', __( 'Sold out', 'flywings-packages' ) );
				}
				if ( $d['availableUntil'] && $d['availableUntil'] < FWP_Data::today() ) {
					$flags[] = array( 'red', __( 'Expired', 'flywings-packages' ) );
				}
				foreach ( $flags as $f ) {
					printf( '<span class="fwp-flag fwp-flag--%s">%s</span> ', esc_attr( $f[0] ), esc_html( $f[1] ) );
				}
				break;
		}
	}

	public static function destination_filter( $post_type ) {
		if ( FWP_Data::POST_TYPE !== $post_type ) {
			return;
		}
		$current = isset( $_GET['fwp_dest'] ) ? sanitize_title( wp_unslash( $_GET['fwp_dest'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$terms   = get_terms(
			array(
				'taxonomy'   => FWP_Data::TAX_DEST,
				'hide_empty' => false,
			)
		);
		echo '<select name="fwp_dest"><option value="">' . esc_html__( 'All destinations', 'flywings-packages' ) . '</option>';
		foreach ( is_array( $terms ) ? $terms : array() as $term ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $term->slug ), selected( $current, $term->slug, false ), esc_html( FWP_Data::term_name( $term ) ) );
		}
		echo '</select>';
	}

	public static function apply_destination_filter( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() || FWP_Data::POST_TYPE !== $query->get( 'post_type' ) || empty( $_GET['fwp_dest'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}
		$query->set(
			'tax_query',
			array(
				array(
					'taxonomy' => FWP_Data::TAX_DEST,
					'field'    => 'slug',
					'terms'    => sanitize_title( wp_unslash( $_GET['fwp_dest'] ) ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				),
			)
		);
	}

	public static function row_actions( $actions, $post ) {
		if ( FWP_Data::POST_TYPE !== $post->post_type ) {
			return $actions;
		}
		unset( $actions['inline hide-if-no-js'] );
		if ( current_user_can( 'edit_post', $post->ID ) ) {
			$actions['fwp_duplicate'] = sprintf(
				'<a href="%s">%s</a>',
				esc_url( self::duplicate_url( $post->ID ) ),
				esc_html__( 'Duplicate', 'flywings-packages' )
			);
		}
		if ( 'publish' === $post->post_status ) {
			$actions['fwp_view'] = sprintf(
				'<a href="%s" target="_blank" rel="noopener">%s</a>',
				esc_url( FWP_Settings::site_url() . '/packages/' . $post->post_name ),
				esc_html__( 'View on website', 'flywings-packages' )
			);
		}
		return $actions;
	}

	/** Raw URL (not HTML-escaped): escape it when printing into HTML. */
	public static function duplicate_url( $post_id ) {
		return add_query_arg(
			array(
				'action'   => 'fwp_duplicate',
				'post'     => (int) $post_id,
				'_wpnonce' => wp_create_nonce( 'fwp_duplicate_' . (int) $post_id ),
			),
			admin_url( 'admin-post.php' )
		);
	}

	/**
	 * Copies a package into a new draft: same content and destination, but
	 * not featured and with no offer, so the copy cannot go live by accident
	 * looking like the original.
	 */
	public static function duplicate() {
		$id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		check_admin_referer( 'fwp_duplicate_' . $id );
		$post = get_post( $id );
		if ( ! $post || FWP_Data::POST_TYPE !== $post->post_type || ! current_user_can( 'edit_post', $id ) ) {
			wp_die( esc_html__( 'This package cannot be duplicated.', 'flywings-packages' ) );
		}

		$d                     = FWP_Data::get( $id );
		$d['featured']         = false;
		$d['offer']['enabled'] = false;

		$new_id = wp_insert_post(
			array(
				'post_type'   => FWP_Data::POST_TYPE,
				'post_status' => 'draft',
				/* translators: %s: original package title */
				'post_title'  => sprintf( __( '%s (copy)', 'flywings-packages' ), $post->post_title ),
				'post_author' => get_current_user_id(),
			),
			true
		);
		if ( is_wp_error( $new_id ) ) {
			wp_die( esc_html( $new_id->get_error_message() ) );
		}
		update_post_meta( $new_id, FWP_Data::META, wp_slash( $d ) );
		self::sync_terms( $new_id, $d );

		wp_safe_redirect( admin_url( 'post.php?action=edit&post=' . $new_id . '&fwp_duplicated=1' ) );
		exit;
	}

	/** Keeps the Destination and Trip type term links in step with the package data. */
	public static function sync_terms( $post_id, array $d ) {
		wp_set_object_terms( $post_id, $d['destination'] ? array( $d['destination'] ) : array(), FWP_Data::TAX_DEST );
		wp_set_object_terms( $post_id, $d['tripTypes'], FWP_Data::TAX_TYPE );
	}

	public static function messages( $messages ) {
		$post = get_post();
		if ( ! $post || FWP_Data::POST_TYPE !== $post->post_type ) {
			return $messages;
		}
		$view = '';
		if ( 'publish' === $post->post_status && $post->post_name ) {
			$view = sprintf(
				' <a href="%s" target="_blank" rel="noopener">%s</a>',
				esc_url( FWP_Settings::site_url() . '/packages/' . $post->post_name ),
				esc_html__( 'View on website', 'flywings-packages' )
			);
		}
		$messages[ FWP_Data::POST_TYPE ] = array(
			0  => '',
			1  => __( 'Package updated.', 'flywings-packages' ) . $view,
			4  => __( 'Package updated.', 'flywings-packages' ),
			5  => isset( $_GET['revision'] ) ? __( 'Package restored from a revision.', 'flywings-packages' ) : false, // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			6  => __( 'Package published.', 'flywings-packages' ) . $view,
			7  => __( 'Package saved.', 'flywings-packages' ),
			8  => __( 'Package submitted.', 'flywings-packages' ),
			9  => __( 'Package scheduled. It goes live on the website at the scheduled time.', 'flywings-packages' ),
			10 => __( 'Draft saved.', 'flywings-packages' ),
		);
		return $messages;
	}

	public static function title_placeholder( $text, $post ) {
		return FWP_Data::POST_TYPE === $post->post_type ? __( 'Full package name, e.g. Dubai 5 Nights / 6 Days Luxury Tour Package', 'flywings-packages' ) : $text;
	}
}
