<?php
/**
 * The read API the website uses, under /wp-json/flywings/v1/.
 *
 *   GET  /packages          Every listed package as a card (slim), the slugs
 *                           of private-link or expired ones, and the slugs
 *                           of packages that have stopped being live.
 *   GET  /packages/{slug}   One package in full. For an old or removed
 *                           slug it answers where to send the visitor.
 *   GET  /preview/{id}      A draft, for the "Preview on website" button.
 *                           Needs the signed link the editor creates.
 *   POST /import            Creates or updates packages from the website's
 *                           PackageData JSON. Administrators only.
 */

defined( 'ABSPATH' ) || exit;

class FWP_Rest {

	const NS = 'flywings/v1';

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes() {
		register_rest_route(
			self::NS,
			'/packages',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'list_packages' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			self::NS,
			'/packages/(?P<slug>[a-z0-9-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_package' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			self::NS,
			'/preview/(?P<id>\d+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'preview' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'exp'   => array( 'required' => true ),
					'token' => array( 'required' => true ),
				),
			)
		);
		register_rest_route(
			self::NS,
			'/offers',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'list_offers' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			self::NS,
			'/offers/import',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'import_offers' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			self::NS,
			'/import',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'import' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	public static function list_packages() {
		self::publish_overdue();

		$posts = get_posts(
			array(
				'post_type'        => FWP_Data::POST_TYPE,
				'post_status'      => 'publish',
				'posts_per_page'   => 500,
				'has_password'     => false,
				'orderby'          => 'date',
				'order'            => 'DESC',
				'no_found_rows'    => true,
				'suppress_filters' => true,
			)
		);
		$packages = array();
		$hidden   = array();
		foreach ( $posts as $post ) {
			$d = FWP_Data::get( $post->ID );
			if ( FWP_Data::is_listed( $d ) ) {
				$packages[] = FWP_Data::to_api( $post, $d, 'list' );
			} else {
				// Private-link and expired packages: only the slug, so their
				// content is not public, yet the website knows they exist.
				$hidden[] = $post->post_name;
			}
		}
		return self::respond(
			array(
				'packages' => $packages,
				'hidden'   => $hidden,
				'gone'     => array_keys( FWP_Data::gone() ),
			)
		);
	}

	/**
	 * A response server caches must not keep. The website caches these
	 * itself and is told when to refresh; a page cache in front of
	 * WordPress (LiteSpeed on Hostinger, for one) would otherwise hand it
	 * the old package right after an edit.
	 */
	private static function respond( $data ) {
		do_action( 'litespeed_control_set_nocache', 'Flywings Packages API' );
		$response = rest_ensure_response( $data );
		$response->header( 'Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0' );
		return $response;
	}

	public static function get_package( WP_REST_Request $request ) {
		$slug = sanitize_title( $request['slug'] );
		$post = FWP_Data::find_published( $slug );
		if ( $post ) {
			return self::respond( array( 'package' => FWP_Data::to_api( $post ) ) );
		}

		// Renamed: WordPress keeps the old slug of a published post.
		$renamed = get_posts(
			array(
				'post_type'        => FWP_Data::POST_TYPE,
				'post_status'      => 'publish',
				'meta_key'         => '_wp_old_slug', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'       => $slug, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'posts_per_page'   => 1,
				'has_password'     => false,
				'suppress_filters' => true,
			)
		);
		if ( $renamed ) {
			return self::respond( array( 'moved' => '/packages/' . $renamed[0]->post_name ) );
		}

		$gone = FWP_Data::gone();
		if ( isset( $gone[ $slug ] ) ) {
			return self::respond(
				array(
					'gone'            => true,
					'destinationSlug' => $gone[ $slug ],
				)
			);
		}

		return new WP_Error( 'fwp_not_found', 'Package not found', array( 'status' => 404 ) );
	}

	public static function preview( WP_REST_Request $request ) {
		$id      = (int) $request['id'];
		$expires = (int) $request['exp'];
		$token   = (string) $request['token'];

		if ( $expires < time() || ! hash_equals( FWP_Settings::preview_token( $id, $expires ), $token ) ) {
			return new WP_Error( 'fwp_preview_denied', 'This preview link has expired. Click "Preview on website" again.', array( 'status' => 403 ) );
		}
		$post = get_post( $id );
		if ( ! $post || FWP_Data::POST_TYPE !== $post->post_type || 'trash' === $post->post_status ) {
			return new WP_Error( 'fwp_not_found', 'Package not found', array( 'status' => 404 ) );
		}

		// The editor stores unsaved changes here when Preview is clicked.
		$draft = get_post_meta( $id, FWP_Data::PREVIEW_META, true );
		$data  = null;
		if ( is_array( $draft ) && isset( $draft['data'] ) ) {
			$data = $draft['data'];
			$post = clone $post;
			if ( isset( $draft['title'] ) ) {
				$post->post_title = $draft['title'];
			}
			if ( ! empty( $draft['slug'] ) ) {
				$post->post_name = $draft['slug'];
			}
		}
		if ( '' === $post->post_name ) {
			$post->post_name = sanitize_title( $post->post_title );
		}

		$package            = FWP_Data::to_api( $post, $data );
		$package['preview'] = true;
		return self::respond( array( 'package' => $package ) );
	}

	/**
	 * Publishes scheduled packages whose time has passed. WordPress's own
	 * scheduler only runs when someone visits the WordPress site, which on
	 * a headless install can be hours late; the website asks for this list
	 * every few minutes, so it is the reliable trigger.
	 */
	/** Covers both post types, so either endpoint releases anything due. */
	private static function publish_overdue() {
		$overdue = get_posts(
			array(
				'post_type'        => array( FWP_Data::POST_TYPE, FWO_Data::POST_TYPE ),
				'post_status'      => 'future',
				'posts_per_page'   => 20,
				'fields'           => 'ids',
				'suppress_filters' => true,
				'date_query'       => array(
					array(
						'column' => 'post_date_gmt',
						'before' => gmdate( 'Y-m-d H:i:s' ),
					),
				),
			)
		);
		foreach ( $overdue as $id ) {
			wp_publish_post( $id );
		}
	}

	/**
	 * Body: { "packages": [PackageData...], "featuredSlugs": [...], "status": "publish"|"draft" }
	 * Relative image paths ("/assets/x.jpg") are made absolute against the
	 * website address, because they are files on the website, not in WordPress.
	 */
	public static function import( WP_REST_Request $request ) {
		$body     = $request->get_json_params();
		$items    = isset( $body['packages'] ) && is_array( $body['packages'] ) ? $body['packages'] : array();
		$featured = isset( $body['featuredSlugs'] ) && is_array( $body['featuredSlugs'] ) ? array_values( $body['featuredSlugs'] ) : array();
		$status   = isset( $body['status'] ) && 'draft' === $body['status'] ? 'draft' : 'publish';
		$site     = FWP_Settings::site_url();
		$result   = array(
			'created' => array(),
			'updated' => array(),
			'skipped' => array(),
		);

		foreach ( $items as $p ) {
			$slug = isset( $p['slug'] ) ? sanitize_title( $p['slug'] ) : '';
			if ( '' === $slug || empty( $p['title'] ) ) {
				$result['skipped'][] = $slug;
				continue;
			}

			$dest = isset( $p['destinationSlug'] ) ? sanitize_title( $p['destinationSlug'] ) : '';
			if ( $dest && ! term_exists( $dest, FWP_Data::TAX_DEST ) ) {
				$term = wp_insert_term( ucwords( str_replace( '-', ' ', $dest ) ), FWP_Data::TAX_DEST, array( 'slug' => $dest ) );
				if ( ! is_wp_error( $term ) ) {
					update_term_meta( $term['term_id'], FWP_Data::REGION_META, 'international' );
				}
			}

			$digits = function ( $v ) {
				return (int) preg_replace( '/\D/', '', (string) $v );
			};
			$images = array();
			foreach ( isset( $p['heroImages'] ) ? (array) $p['heroImages'] : array() as $url ) {
				$url      = (string) $url;
				$images[] = array(
					'id'  => 0,
					'url' => 0 === strpos( $url, '/' ) ? $site . $url : $url,
					'alt' => '',
				);
			}
			$tiers = array();
			foreach ( isset( $p['pricingTiers'] ) ? (array) $p['pricingTiers'] : array() as $t ) {
				$tiers[] = array(
					'label'         => isset( $t['label'] ) ? $t['label'] : '',
					'price'         => $digits( isset( $t['price'] ) ? $t['price'] : '' ),
					'originalPrice' => $digits( isset( $t['originalPrice'] ) ? $t['originalPrice'] : '' ),
					'description'   => isset( $t['description'] ) ? $t['description'] : '',
				);
			}
			$order = array_search( $slug, $featured, true );

			$data = FWP_Data::sanitize(
				array(
					'shortTitle'         => isset( $p['shortTitle'] ) ? $p['shortTitle'] : '',
					'tagline'            => isset( $p['tagline'] ) ? $p['tagline'] : '',
					'destination'        => $dest,
					'nights'             => isset( $p['nights'] ) ? $p['nights'] : 0,
					'cities'             => isset( $p['destinations'] ) ? $p['destinations'] : array(),
					'hotelCategory'      => isset( $p['hotelCategory'] ) ? $p['hotelCategory'] : '',
					'mealsIncluded'      => isset( $p['mealsIncluded'] ) ? $p['mealsIncluded'] : '',
					'transferIncluded'   => ! empty( $p['transferIncluded'] ),
					'images'             => $images,
					'overview'           => isset( $p['overview'] ) ? $p['overview'] : '',
					'itinerary'          => isset( $p['itinerary'] ) ? $p['itinerary'] : array(),
					'inclusions'         => isset( $p['inclusions'] ) ? $p['inclusions'] : array(),
					'exclusions'         => isset( $p['exclusions'] ) ? $p['exclusions'] : array(),
					'hotels'             => isset( $p['hotels'] ) ? $p['hotels'] : array(),
					'showPrice'          => false,
					'startingPrice'      => $digits( isset( $p['startingPrice'] ) ? $p['startingPrice'] : '' ),
					'originalPrice'      => $digits( isset( $p['originalPrice'] ) ? $p['originalPrice'] : '' ),
					'pricingTiers'       => $tiers,
					'childPrice'         => isset( $p['childPrice'] ) ? $p['childPrice'] : '',
					'emiAvailable'       => ! empty( $p['emiAvailable'] ),
					'faqs'               => isset( $p['faqs'] ) ? $p['faqs'] : array(),
					'cancellationPolicy' => isset( $p['cancellationPolicy'] ) ? $p['cancellationPolicy'] : array(),
					'relatedSlugs'       => isset( $p['relatedSlugs'] ) ? $p['relatedSlugs'] : array(),
					'metaTitle'          => isset( $p['metaTitle'] ) ? $p['metaTitle'] : '',
					'metaDescription'    => isset( $p['metaDescription'] ) ? $p['metaDescription'] : '',
					'keywords'           => isset( $p['keywords'] ) ? $p['keywords'] : array(),
					'badge'              => isset( $p['badge'] ) ? $p['badge'] : '',
					'listed'             => true,
					'featured'           => false !== $order,
					'featuredOrder'      => false !== $order ? $order + 1 : 0,
					'rating'             => isset( $p['rating'] ) ? $p['rating'] : 0,
					'reviewCount'        => isset( $p['reviewCount'] ) ? $p['reviewCount'] : 0,
				)
			);

			$existing = get_posts(
				array(
					'post_type'        => FWP_Data::POST_TYPE,
					'post_status'      => array( 'publish', 'draft', 'pending', 'future', 'private' ),
					'name'             => $slug,
					'posts_per_page'   => 1,
					'fields'           => 'ids',
					'suppress_filters' => true,
				)
			);
			$args = array(
				'post_type'   => FWP_Data::POST_TYPE,
				'post_title'  => wp_strip_all_tags( (string) $p['title'] ),
				'post_name'   => $slug,
				'post_status' => $status,
			);
			if ( $existing ) {
				$args['ID'] = $existing[0];
			}

			// The save queues one website refresh, sent after the last package is written.
			$id = $existing ? wp_update_post( wp_slash( $args ), true ) : wp_insert_post( wp_slash( $args ), true );
			if ( is_wp_error( $id ) ) {
				$result['skipped'][] = $slug;
				continue;
			}
			update_post_meta( $id, FWP_Data::META, wp_slash( $data ) );
			FWP_Post_Type::sync_terms( $id, $data );

			$result[ $existing ? 'updated' : 'created' ][] = $slug;
		}

		return rest_ensure_response( $result );
	}

	/* ─── Offers ─────────────────────────────────────────────────────────── */

	/**
	 * Every offer the website should show today.
	 *
	 * Expired and hidden offers are left out entirely rather than sent
	 * with a flag: unlike a package an offer has no page of its own, so
	 * there is nothing for the website to do with one it must not show.
	 */
	public static function list_offers() {
		self::publish_overdue();

		$posts = get_posts(
			array(
				'post_type'        => FWO_Data::POST_TYPE,
				'post_status'      => 'publish',
				'posts_per_page'   => 200,
				'has_password'     => false,
				'orderby'          => 'menu_order date',
				'order'            => 'ASC',
				'no_found_rows'    => true,
				'suppress_filters' => true,
			)
		);
		$offers = array();
		foreach ( $posts as $post ) {
			$d = FWO_Data::get( $post->ID );
			if ( FWO_Data::is_live( $d ) ) {
				$offers[] = FWO_Data::to_api( $post, $d );
			}
		}
		return self::respond( array( 'offers' => $offers ) );
	}

	/**
	 * Copies the offers hard-coded in src/data/quotedPackages.ts into
	 * WordPress, so nobody retypes them. Run once; see the README.
	 */
	public static function import_offers( WP_REST_Request $request ) {
		$body   = $request->get_json_params();
		$items  = isset( $body['offers'] ) && is_array( $body['offers'] ) ? $body['offers'] : array();
		$status = isset( $body['status'] ) && 'draft' === $body['status'] ? 'draft' : 'publish';
		$site   = FWP_Settings::site_url();
		$result = array(
			'created' => array(),
			'updated' => array(),
			'skipped' => array(),
		);

		$digits = function ( $v ) {
			return (int) preg_replace( '/\D/', '', (string) $v );
		};

		foreach ( $items as $o ) {
			$slug = isset( $o['slug'] ) ? sanitize_title( $o['slug'] ) : '';
			if ( '' === $slug || empty( $o['name'] ) ) {
				$result['skipped'][] = $slug;
				continue;
			}

			$image_url = isset( $o['image'] ) ? (string) $o['image'] : '';
			if ( '' !== $image_url && 0 === strpos( $image_url, '/' ) ) {
				$image_url = $site . $image_url;
			}

			$compare     = isset( $o['compareWith'] ) && is_array( $o['compareWith'] ) ? $o['compareWith'] : array();
			$has_compare = ! empty( $compare );

			$data = FWO_Data::sanitize(
				array(
					'region'        => isset( $o['region'] ) ? $o['region'] : '',
					'duration'      => isset( $o['duration'] ) ? $o['duration'] : '',
					'cities'        => isset( $o['cities'] ) ? $o['cities'] : array(),
					'hotelCategory' => isset( $o['hotelCategory'] ) ? $o['hotelCategory'] : '',
					'startingPrice' => $digits( isset( $o['startingPrice'] ) ? $o['startingPrice'] : 0 ),
					'minPax'        => isset( $o['minPax'] ) ? $o['minPax'] : 2,
					'itinerary'     => isset( $o['itinerary'] ) ? $o['itinerary'] : array(),
					'inclusions'    => isset( $o['inclusions'] ) ? $o['inclusions'] : array(),
					'image'         => array(
						'id'  => 0,
						'url' => $image_url,
						'alt' => isset( $o['imageAlt'] ) ? $o['imageAlt'] : '',
					),
					'compare'       => array(
						'enabled'  => $has_compare,
						'label'    => isset( $compare['label'] ) ? $compare['label'] : '',
						'price'    => $digits( isset( $compare['price'] ) ? $compare['price'] : 0 ),
						'href'     => isset( $compare['href'] ) ? $compare['href'] : '',
						'sameTrip' => ! empty( $compare['sameTrip'] ),
						'note'     => isset( $compare['note'] ) ? $compare['note'] : '',
					),
					'validTill'     => isset( $o['validTill'] ) ? $o['validTill'] : '',
					'listed'        => true,
				)
			);

			$existing = get_posts(
				array(
					'post_type'        => FWO_Data::POST_TYPE,
					'post_status'      => 'any',
					'name'             => $slug,
					'posts_per_page'   => 1,
					'no_found_rows'    => true,
					'suppress_filters' => true,
				)
			);
			$existing = $existing ? $existing[0] : null;

			$postarr = array(
				'post_type'   => FWO_Data::POST_TYPE,
				'post_title'  => wp_strip_all_tags( (string) $o['name'] ),
				'post_name'   => $slug,
				'post_status' => $status,
			);
			if ( $existing ) {
				$postarr['ID'] = $existing->ID;
			}

			$id = wp_insert_post( wp_slash( $postarr ), true );
			if ( is_wp_error( $id ) ) {
				$result['skipped'][] = $slug;
				continue;
			}
			update_post_meta( $id, FWO_Data::META, wp_slash( $data ) );
			$result[ $existing ? 'updated' : 'created' ][] = $slug;
		}

		FWP_Sync::queue();
		return rest_ensure_response( $result );
	}

}
