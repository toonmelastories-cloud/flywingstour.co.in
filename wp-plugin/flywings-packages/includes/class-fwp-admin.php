<?php
/**
 * The package edit screen.
 *
 * The screen is WordPress's own post editor (title, Publish box, revisions,
 * edit lock) with one "Package details" box holding the editor app from
 * assets/admin.js. The app keeps the whole package as JSON in a hidden
 * field, so a normal Save Draft / Publish / Update stores it.
 *
 * Saving is guarded: a package missing something the website needs is
 * held back as a draft, and an edit that would break a live package is
 * not saved at all (the live page stays as it was, and the editor reopens
 * with the edits so nothing typed is lost).
 */

defined( 'ABSPATH' ) || exit;

class FWP_Admin {

	const NONCE_ACTION = 'fwp_save';
	const NONCE_FIELD  = 'fwp_nonce';
	const AJAX_ACTION  = 'fwp_ajax';

	/** post_id => errors, for live packages whose edit was refused in this request. */
	private static $refused = array();

	private static $config = null;

	public static function init() {
		add_action( 'add_meta_boxes_' . FWP_Data::POST_TYPE, array( __CLASS__, 'meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_filter( 'wp_insert_post_data', array( __CLASS__, 'filter_post_data' ), 99, 2 );
		add_action( 'save_post_' . FWP_Data::POST_TYPE, array( __CLASS__, 'save' ), 10, 2 );
		add_filter( 'redirect_post_location', array( __CLASS__, 'redirect_location' ), 10, 2 );
		add_action( 'admin_notices', array( __CLASS__, 'notices' ) );
		add_filter( 'admin_body_class', array( __CLASS__, 'body_class' ) );
		add_action( 'wp_ajax_fwp_preview', array( __CLASS__, 'ajax_preview' ) );
		add_action( 'wp_ajax_fwp_add_destination', array( __CLASS__, 'ajax_add_destination' ) );
	}

	/* ─── Screen ─────────────────────────────────────────────────────────── */

	public static function meta_boxes( $post ) {
		remove_meta_box( 'slugdiv', FWP_Data::POST_TYPE, 'normal' );
		add_meta_box( 'fwp-editor', __( 'Package details', 'flywings-packages' ), array( __CLASS__, 'render_editor' ), FWP_Data::POST_TYPE, 'normal', 'high' );
		add_meta_box( 'fwp-sidebar', __( 'How it looks on the website', 'flywings-packages' ), array( __CLASS__, 'render_sidebar' ), FWP_Data::POST_TYPE, 'side', 'default' );
	}

	public static function render_editor( $post ) {
		$config = self::config( $post );
		wp_nonce_field( self::NONCE_ACTION, self::NONCE_FIELD );
		// Pre-filled with the saved package, so a save without JavaScript keeps it intact.
		printf( '<input type="hidden" id="fwp-data-input" name="fwp_data" value="%s" />', esc_attr( wp_json_encode( $config['data'] ) ) );
		echo '<div id="fwp-app" class="fwp-app"><p class="fwp-loading">' . esc_html__( 'Loading the package editor...', 'flywings-packages' ) . '</p></div>';
	}

	public static function render_sidebar() {
		echo '<div id="fwp-sidebar-root"></div>';
	}

	public static function body_class( $classes ) {
		$screen = get_current_screen();
		if ( $screen && FWP_Data::POST_TYPE === $screen->post_type ) {
			$classes .= ' fwp-screen';
		}
		return $classes;
	}

	public static function enqueue( $hook ) {
		$screen = get_current_screen();
		if ( ! $screen || FWP_Data::POST_TYPE !== $screen->post_type ) {
			return;
		}
		wp_enqueue_style( 'fwp-admin', FWP_URL . 'assets/admin.css', array( 'wp-components' ), self::asset_version( 'assets/admin.css' ) );
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}
		$post = get_post();
		if ( ! $post ) {
			return;
		}
		wp_enqueue_media( array( 'post' => $post->ID ) );
		wp_enqueue_script( 'fwp-admin', FWP_URL . 'assets/admin.js', array( 'wp-element', 'wp-components', 'jquery' ), self::asset_version( 'assets/admin.js' ), true );
		wp_add_inline_script( 'fwp-admin', 'window.fwpAdmin = ' . wp_json_encode( self::config( $post ) ) . ';', 'before' );
	}

	private static function asset_version( $file ) {
		$path = FWP_DIR . $file;
		return file_exists( $path ) ? FWP_VERSION . '.' . filemtime( $path ) : FWP_VERSION;
	}

	private static function refused_key( $post_id ) {
		return 'fwp_refused_' . (int) $post_id . '_' . get_current_user_id();
	}

	private static function flash_key() {
		return 'fwp_flash_' . get_current_user_id();
	}

	/** Everything the editor app starts with. Built once per request. */
	public static function config( $post ) {
		if ( null !== self::$config ) {
			return self::$config;
		}
		$is_new = 'auto-draft' === $post->post_status;
		$data   = $is_new ? FWP_Data::new_package_defaults() : FWP_Data::get( $post->ID );
		$slug   = $is_new ? '' : $post->post_name;

		// A refused edit to a live package comes back so nothing typed is lost.
		$refused = get_transient( self::refused_key( $post->ID ) );
		if ( is_array( $refused ) && isset( $refused['data'] ) ) {
			delete_transient( self::refused_key( $post->ID ) );
			$data = FWP_Data::merge( $refused['data'] );
			$slug = isset( $refused['slug'] ) ? $refused['slug'] : $slug;
		} else {
			$refused = null;
		}
		$data['slug'] = $slug;

		$destinations = array();
		$terms        = get_terms(
			array(
				'taxonomy'   => FWP_Data::TAX_DEST,
				'hide_empty' => false,
			)
		);
		foreach ( is_array( $terms ) ? $terms : array() as $t ) {
			$destinations[] = array(
				'slug'   => $t->slug,
				'name'   => FWP_Data::term_name( $t ),
				'region' => 'india' === get_term_meta( $t->term_id, FWP_Data::REGION_META, true ) ? 'india' : 'international',
			);
		}
		$types = array();
		$terms = get_terms(
			array(
				'taxonomy'   => FWP_Data::TAX_TYPE,
				'hide_empty' => false,
			)
		);
		foreach ( is_array( $terms ) ? $terms : array() as $t ) {
			$types[] = array(
				'slug' => $t->slug,
				'name' => FWP_Data::term_name( $t ),
			);
		}

		$others = array();
		foreach ( get_posts(
			array(
				'post_type'        => FWP_Data::POST_TYPE,
				'post_status'      => array( 'publish', 'draft', 'future', 'pending' ),
				'posts_per_page'   => 300,
				'exclude'          => array( $post->ID ),
				'suppress_filters' => true,
			)
		) as $o ) {
			if ( $o->post_name ) {
				$others[] = array(
					'slug'  => $o->post_name,
					'title' => $o->post_title,
					'live'  => 'publish' === $o->post_status,
				);
			}
		}

		$site = FWP_Settings::site_url();

		self::$config = array(
			'postId'        => $post->ID,
			'status'        => $post->post_status,
			'isNew'         => $is_new,
			'data'          => $data,
			'siteUrl'       => $site,
			'liveUrl'       => 'publish' === $post->post_status && $post->post_name ? $site . '/packages/' . $post->post_name : '',
			'destinations'  => $destinations,
			'tripTypes'     => $types,
			'otherPackages' => $others,
			'presets'       => array(
				'inclusions'      => FWP_Settings::lines( 'inclusion_presets' ),
				'exclusions'      => FWP_Settings::lines( 'exclusion_presets' ),
				'badges'          => array( 'Best Seller', 'Honeymoon Pick', 'Family Fav', 'Luxury', 'New', 'Limited Seats', 'Budget Pick', 'Trending' ),
				'hotelCategories' => array( '3 Star', '4 Star', '5 Star', '3 & 4 Star', '4 & 5 Star', 'Houseboat + Hotel', 'Resort', 'Villa' ),
				'meals'           => array( 'Breakfast', 'Breakfast + Dinner', 'All Meals', 'Breakfast + Lunch', 'As per itinerary', 'No meals' ),
				'dayMeals'        => array( 'Breakfast', 'Breakfast + Dinner', 'Breakfast + Lunch + Dinner', 'Dinner', 'Lunch', 'No meals' ),
				'tiers'           => array(
					array( 'label' => 'Per Person (Twin Sharing)', 'description' => '2 adults sharing one room' ),
					array( 'label' => 'Per Person (Triple Sharing)', 'description' => '3 adults sharing one room' ),
					array( 'label' => 'Solo Traveller (Single Room)', 'description' => 'Private room for one adult' ),
					array( 'label' => 'Group (10+ Pax)', 'description' => 'Best rate for groups of 10 or more' ),
				),
			),
			'defaultFaqs'   => FWP_Settings::default_faqs(),
			'defaultPolicy' => FWP_Settings::lines( 'default_policy' ),
			'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
			'nonce'         => wp_create_nonce( self::AJAX_ACTION ),
			'ping'          => FWP_Settings::last_ping_summary(),
			'secretSet'     => '' !== FWP_Settings::secret(),
			'canAddTerms'   => current_user_can( 'edit_pages' ),
			'duplicateUrl'  => $is_new ? '' : FWP_Post_Type::duplicate_url( $post->ID ),
			'refused'       => $refused ? $refused['errors'] : null,
		);
		return self::$config;
	}

	/* ─── Saving ─────────────────────────────────────────────────────────── */

	/** The package JSON from the edit form, or null when this request is not our form. */
	private static function posted( $post_id ) {
		if ( ! isset( $_POST[ self::NONCE_FIELD ], $_POST['fwp_data'], $_POST['post_ID'] ) ) {
			return null;
		}
		if ( ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST[ self::NONCE_FIELD ] ) ), self::NONCE_ACTION ) ) {
			return null;
		}
		if ( (int) $_POST['post_ID'] !== (int) $post_id ) {
			return null;
		}
		$raw = json_decode( wp_unslash( $_POST['fwp_data'] ), true ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized by FWP_Data::sanitize().
		return is_array( $raw ) ? $raw : null;
	}

	/**
	 * Sets the URL slug from the editor and applies the publish guard,
	 * before WordPress writes the post row.
	 */
	public static function filter_post_data( $data, $postarr ) {
		if ( FWP_Data::POST_TYPE !== $data['post_type'] || in_array( $data['post_status'], array( 'auto-draft', 'inherit', 'trash' ), true ) ) {
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
		if ( in_array( $slug, FWP_Data::RESERVED_SLUGS, true ) ) {
			$slug .= '-package';
		}
		if ( '' !== $slug ) {
			$data['post_name'] = wp_unique_post_slug( $slug, $id, $data['post_status'], FWP_Data::POST_TYPE, 0 );
		}

		if ( ! in_array( $data['post_status'], array( 'publish', 'future' ), true ) ) {
			return $data;
		}
		$errors = FWP_Data::publish_errors( FWP_Data::sanitize( $raw ), $title );
		if ( ! $errors ) {
			return $data;
		}

		$old = $id ? get_post( $id ) : null;
		if ( $old && in_array( $old->post_status, array( 'publish', 'future' ), true ) ) {
			// Live package: keep the live version exactly as it is.
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
		$clean = FWP_Data::sanitize( $raw );

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

		update_post_meta( $post_id, FWP_Data::META, wp_slash( $clean ) );
		FWP_Post_Type::sync_terms( $post_id, $clean );
		delete_post_meta( $post_id, FWP_Data::PREVIEW_META );
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

	/** Drops WordPress's "Package published/updated" message when the save was held back. */
	public static function redirect_location( $location, $post_id ) {
		if ( FWP_Data::POST_TYPE !== get_post_type( $post_id ) ) {
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
		if ( ! $screen || FWP_Data::POST_TYPE !== $screen->post_type ) {
			return;
		}

		if ( 'post' === $screen->base ) {
			$post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$flash   = get_transient( self::flash_key() );
			if ( is_array( $flash ) && $post_id && (int) $flash['post'] === $post_id ) {
				delete_transient( self::flash_key() );
				$intro = 'refused' === $flash['type']
					? __( 'Your changes were not saved, so the live package on the website is unchanged. Your edits are still in the form below. Fix these, then click Update:', 'flywings-packages' )
					: __( 'Saved as a draft, not published yet. Fix these, then click Publish:', 'flywings-packages' );
				echo '<div class="notice notice-error fwp-notice"><p><strong>' . esc_html( $intro ) . '</strong></p><ul>';
				foreach ( $flash['errors'] as $e ) {
					echo '<li>' . esc_html( $e ) . '</li>';
				}
				echo '</ul></div>';
			}
			if ( ! empty( $_GET['fwp_duplicated'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'This is a copy, saved as a draft. Change the title, dates, prices or anything else, then publish it.', 'flywings-packages' ) . '</p></div>';
			}
		}

		if ( '' === FWP_Settings::secret() && current_user_can( 'manage_options' ) ) {
			printf(
				'<div class="notice notice-warning"><p>%s <a href="%s">%s</a></p></div>',
				esc_html__( 'The website will not refresh when packages change until the refresh secret is set.', 'flywings-packages' ),
				esc_url( admin_url( 'edit.php?post_type=' . FWP_Data::POST_TYPE . '&page=' . FWP_Settings::PAGE_SLUG ) ),
				esc_html__( 'Open Package Settings', 'flywings-packages' )
			);
		}
	}

	/* ─── Editor AJAX ────────────────────────────────────────────────────── */

	/**
	 * Stores the editor's current (unsaved) state for the preview and
	 * returns a signed preview link. The live package is not touched.
	 */
	public static function ajax_preview() {
		check_ajax_referer( self::AJAX_ACTION, 'nonce' );
		$id = isset( $_POST['postId'] ) ? absint( $_POST['postId'] ) : 0;
		if ( ! $id || FWP_Data::POST_TYPE !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
			wp_send_json_error( array( 'message' => __( 'You cannot preview this package.', 'flywings-packages' ) ), 403 );
		}
		$raw   = isset( $_POST['data'] ) ? json_decode( wp_unslash( $_POST['data'] ), true ) : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized below.
		$title = isset( $_POST['title'] ) ? FWP_Data::line( wp_unslash( $_POST['title'] ), 250 ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$slug  = is_array( $raw ) && isset( $raw['slug'] ) ? sanitize_title( (string) $raw['slug'] ) : '';
		update_post_meta(
			$id,
			FWP_Data::PREVIEW_META,
			wp_slash(
				array(
					'data'  => FWP_Data::sanitize( is_array( $raw ) ? $raw : array() ),
					'title' => $title,
					'slug'  => $slug ? $slug : sanitize_title( $title ),
					'saved' => time(),
				)
			)
		);
		wp_send_json_success( array( 'url' => FWP_Settings::preview_url( $id ) ) );
	}

	/** "+ New destination" in the editor. */
	public static function ajax_add_destination() {
		check_ajax_referer( self::AJAX_ACTION, 'nonce' );
		if ( ! current_user_can( 'edit_pages' ) ) {
			wp_send_json_error( array( 'message' => __( 'You cannot add destinations.', 'flywings-packages' ) ), 403 );
		}
		$name   = isset( $_POST['name'] ) ? FWP_Data::line( wp_unslash( $_POST['name'] ), 80 ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$region = isset( $_POST['region'] ) && 'india' === $_POST['region'] ? 'india' : 'international';
		if ( '' === $name ) {
			wp_send_json_error( array( 'message' => __( 'Type the destination name.', 'flywings-packages' ) ), 400 );
		}
		$existing = term_exists( sanitize_title( $name ), FWP_Data::TAX_DEST );
		if ( $existing ) {
			$term_id = (int) $existing['term_id'];
		} else {
			$term = wp_insert_term( $name, FWP_Data::TAX_DEST );
			if ( is_wp_error( $term ) ) {
				wp_send_json_error( array( 'message' => $term->get_error_message() ), 400 );
			}
			$term_id = (int) $term['term_id'];
			update_term_meta( $term_id, FWP_Data::REGION_META, $region );
		}
		$term = get_term( $term_id, FWP_Data::TAX_DEST );
		wp_send_json_success(
			array(
				'slug'   => $term->slug,
				'name'   => FWP_Data::term_name( $term ),
				'region' => 'india' === get_term_meta( $term_id, FWP_Data::REGION_META, true ) ? 'india' : 'international',
			)
		);
	}
}
