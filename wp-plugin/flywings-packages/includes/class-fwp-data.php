<?php
/**
 * The package record: its default shape, how submitted values are
 * cleaned, the publish checks, and the JSON the website reads.
 *
 * Everything a package holds lives in one post meta array (META) so a
 * save is atomic and a revision restores the whole package. The title
 * and URL slug are the post's own title and post_name.
 *
 * The JSON from to_api() mirrors the website's PackageData type in
 * src/data/packages.ts, so the existing page design renders it as is.
 */

defined( 'ABSPATH' ) || exit;

class FWP_Data {

	const POST_TYPE    = 'fw_package';
	const META         = '_fwp_data';
	const PREVIEW_META = '_fwp_preview';
	const TAX_DEST     = 'fw_destination';
	const TAX_TYPE     = 'fw_trip_type';
	const REGION_META  = 'fwp_region';
	const GONE_OPTION  = 'fwp_gone';

	/** Slugs the website routes itself, so a package may not take them. */
	const RESERVED_SLUGS = array( 'preview' );

	public static function defaults() {
		return array(
			'shortTitle'         => '',
			'tagline'            => '',
			'destination'        => '',
			'tripTypes'          => array(),
			'nights'             => 0,
			'cities'             => array(),
			'hotelCategory'      => '',
			'mealsIncluded'      => '',
			'transferIncluded'   => true,
			'images'             => array(),
			'overview'           => '',
			'itinerary'          => array(),
			'inclusions'         => array(),
			'exclusions'         => array(),
			'hotels'             => array(),
			'showPrice'          => false,
			'priceOnRequest'     => false,
			'startingPrice'      => 0,
			'originalPrice'      => 0,
			'pricingTiers'       => array(),
			'childPrice'         => '',
			'emiAvailable'       => false,
			'faqs'               => array(),
			'cancellationPolicy' => array(),
			'relatedSlugs'       => array(),
			'metaTitle'          => '',
			'metaDescription'    => '',
			'keywords'           => array(),
			'badge'              => '',
			'listed'             => true,
			'featured'           => false,
			'featuredOrder'      => 0,
			'soldOut'            => false,
			'availableUntil'     => '',
			'rating'             => 0,
			'reviewCount'        => 0,
			'offer'              => self::offer_defaults(),
		);
	}

	public static function offer_defaults() {
		return array(
			'enabled'      => false,
			'price'        => 0,
			'comparePrice' => 0,
			'validTill'    => '',
			'minPax'       => 2,
			'note'         => '',
		);
	}

	/** Defaults plus the standard policy and FAQs from Settings, for a brand new package. */
	public static function new_package_defaults() {
		$d                       = self::defaults();
		$d['cancellationPolicy'] = FWP_Settings::lines( 'default_policy' );
		$d['faqs']               = FWP_Settings::default_faqs();
		return $d;
	}

	/** A term's display name. WordPress stores "&" in term names as "&amp;". */
	public static function term_name( $term ) {
		return html_entity_decode( $term->name, ENT_QUOTES, 'UTF-8' );
	}

	/** Saved data merged over defaults, so older records gain new fields safely. */
	public static function get( $post_id ) {
		$saved = get_post_meta( $post_id, self::META, true );
		return self::merge( is_array( $saved ) ? $saved : array() );
	}

	public static function merge( array $saved ) {
		$d          = wp_parse_args( $saved, self::defaults() );
		$d['offer'] = wp_parse_args( is_array( $d['offer'] ) ? $d['offer'] : array(), self::offer_defaults() );
		return $d;
	}

	/* ─── Cleaning ───────────────────────────────────────────────────────── */

	/** One line of plain text. Unlike sanitize_text_field it keeps "50%off"-style text intact. */
	public static function line( $v, $max = 300 ) {
		$v = wp_check_invalid_utf8( is_scalar( $v ) ? (string) $v : '' );
		$v = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( $v ) ) );
		return mb_substr( $v, 0, $max );
	}

	/** Multi-line plain text; paragraph breaks are kept. */
	public static function text( $v, $max = 5000 ) {
		$v = wp_check_invalid_utf8( is_scalar( $v ) ? (string) $v : '' );
		$v = str_replace( array( "\r\n", "\r" ), "\n", wp_strip_all_tags( $v ) );
		$v = preg_replace( "/\n{3,}/", "\n\n", $v );
		$v = preg_replace( '/[ \t]+/u', ' ', $v );
		return mb_substr( trim( $v ), 0, $max );
	}

	public static function flag( $v ) {
		return (bool) filter_var( $v, FILTER_VALIDATE_BOOLEAN );
	}

	public static function int( $v, $min = 0, $max = PHP_INT_MAX ) {
		$n = is_numeric( $v ) ? (int) round( (float) $v ) : 0;
		return max( $min, min( $max, $n ) );
	}

	public static function date( $v ) {
		$v = is_string( $v ) ? trim( $v ) : '';
		return preg_match( '/^\d{4}-\d{2}-\d{2}$/', $v ) ? $v : '';
	}

	/** List of non-empty single lines. */
	public static function lines( $v, $max_items = 50, $max_len = 300 ) {
		$out = array();
		foreach ( is_array( $v ) ? $v : array() as $item ) {
			$item = self::line( $item, $max_len );
			if ( '' !== $item ) {
				$out[] = $item;
			}
			if ( count( $out ) >= $max_items ) {
				break;
			}
		}
		return $out;
	}

	public static function slugs( $v, $max = 20 ) {
		$out = array();
		foreach ( is_array( $v ) ? $v : array() as $item ) {
			$s = sanitize_title( is_scalar( $item ) ? (string) $item : '' );
			if ( '' !== $s && ! in_array( $s, $out, true ) ) {
				$out[] = $s;
			}
		}
		return array_slice( $out, 0, $max );
	}

	/** Cleans a package submitted from the editor (or the importer) into the stored shape. */
	public static function sanitize( $raw ) {
		$raw = is_array( $raw ) ? $raw : array();
		$d   = self::defaults();
		$get = function ( $key ) use ( $raw, $d ) {
			return array_key_exists( $key, $raw ) ? $raw[ $key ] : $d[ $key ];
		};

		$out = array(
			'shortTitle'         => self::line( $get( 'shortTitle' ), 80 ),
			'tagline'            => self::line( $get( 'tagline' ), 250 ),
			'destination'        => sanitize_title( (string) $get( 'destination' ) ),
			'tripTypes'          => self::slugs( $get( 'tripTypes' ) ),
			'nights'             => self::int( $get( 'nights' ), 0, 60 ),
			'cities'             => self::lines( $get( 'cities' ), 20, 80 ),
			'hotelCategory'      => self::line( $get( 'hotelCategory' ), 60 ),
			'mealsIncluded'      => self::line( $get( 'mealsIncluded' ), 80 ),
			'transferIncluded'   => self::flag( $get( 'transferIncluded' ) ),
			'images'             => array(),
			'overview'           => self::text( $get( 'overview' ), 8000 ),
			'itinerary'          => array(),
			'inclusions'         => self::lines( $get( 'inclusions' ), 60 ),
			'exclusions'         => self::lines( $get( 'exclusions' ), 60 ),
			'hotels'             => array(),
			'showPrice'          => self::flag( $get( 'showPrice' ) ),
			'priceOnRequest'     => self::flag( $get( 'priceOnRequest' ) ),
			'startingPrice'      => self::int( $get( 'startingPrice' ), 0, 100000000 ),
			'originalPrice'      => self::int( $get( 'originalPrice' ), 0, 100000000 ),
			'pricingTiers'       => array(),
			'childPrice'         => self::line( $get( 'childPrice' ), 150 ),
			'emiAvailable'       => self::flag( $get( 'emiAvailable' ) ),
			'faqs'               => array(),
			'cancellationPolicy' => self::lines( $get( 'cancellationPolicy' ), 30, 400 ),
			'relatedSlugs'       => self::slugs( $get( 'relatedSlugs' ), 6 ),
			'metaTitle'          => self::line( $get( 'metaTitle' ), 120 ),
			'metaDescription'    => self::line( $get( 'metaDescription' ), 300 ),
			'keywords'           => self::lines( $get( 'keywords' ), 20, 100 ),
			'badge'              => self::line( $get( 'badge' ), 40 ),
			'listed'             => self::flag( $get( 'listed' ) ),
			'featured'           => self::flag( $get( 'featured' ) ),
			'featuredOrder'      => self::int( $get( 'featuredOrder' ), 0, 99 ),
			'soldOut'            => self::flag( $get( 'soldOut' ) ),
			'availableUntil'     => self::date( $get( 'availableUntil' ) ),
			'rating'             => max( 0, min( 5, round( (float) $get( 'rating' ), 1 ) ) ),
			'reviewCount'        => self::int( $get( 'reviewCount' ), 0, 1000000 ),
			'offer'              => self::offer_defaults(),
		);

		foreach ( (array) $get( 'images' ) as $img ) {
			if ( ! is_array( $img ) ) {
				continue;
			}
			$id  = self::int( isset( $img['id'] ) ? $img['id'] : 0 );
			$url = esc_url_raw( isset( $img['url'] ) ? (string) $img['url'] : '' );
			if ( $id && '' === $url ) {
				$url = (string) wp_get_attachment_url( $id );
			}
			if ( '' === $url ) {
				continue;
			}
			$out['images'][] = array(
				'id'    => $id,
				'url'   => $url,
				'thumb' => esc_url_raw( isset( $img['thumb'] ) ? (string) $img['thumb'] : '' ),
				'alt'   => self::line( isset( $img['alt'] ) ? $img['alt'] : '', 200 ),
				'w'     => self::int( isset( $img['w'] ) ? $img['w'] : 0 ),
				'h'     => self::int( isset( $img['h'] ) ? $img['h'] : 0 ),
			);
			if ( count( $out['images'] ) >= 20 ) {
				break;
			}
		}

		foreach ( (array) $get( 'itinerary' ) as $day ) {
			if ( ! is_array( $day ) ) {
				continue;
			}
			$out['itinerary'][] = array(
				'title'       => self::line( isset( $day['title'] ) ? $day['title'] : '', 200 ),
				'description' => self::text( isset( $day['description'] ) ? $day['description'] : '', 3000 ),
				'activities'  => self::lines( isset( $day['activities'] ) ? $day['activities'] : array(), 30 ),
				'meals'       => self::line( isset( $day['meals'] ) ? $day['meals'] : '', 120 ),
				'hotel'       => self::line( isset( $day['hotel'] ) ? $day['hotel'] : '', 200 ),
			);
			if ( count( $out['itinerary'] ) >= 61 ) {
				break;
			}
		}

		foreach ( (array) $get( 'hotels' ) as $h ) {
			if ( ! is_array( $h ) || '' === self::line( isset( $h['name'] ) ? $h['name'] : '' ) ) {
				continue;
			}
			$out['hotels'][] = array(
				'name'          => self::line( $h['name'], 150 ),
				'stars'         => self::int( isset( $h['stars'] ) ? $h['stars'] : 0, 0, 7 ),
				'location'      => self::line( isset( $h['location'] ) ? $h['location'] : '', 150 ),
				'roomType'      => self::line( isset( $h['roomType'] ) ? $h['roomType'] : '', 150 ),
				'upgradeOption' => self::line( isset( $h['upgradeOption'] ) ? $h['upgradeOption'] : '', 250 ),
			);
		}

		foreach ( (array) $get( 'pricingTiers' ) as $t ) {
			if ( ! is_array( $t ) || '' === self::line( isset( $t['label'] ) ? $t['label'] : '' ) ) {
				continue;
			}
			$out['pricingTiers'][] = array(
				'label'         => self::line( $t['label'], 100 ),
				'price'         => self::int( isset( $t['price'] ) ? $t['price'] : 0, 0, 100000000 ),
				'originalPrice' => self::int( isset( $t['originalPrice'] ) ? $t['originalPrice'] : 0, 0, 100000000 ),
				'description'   => self::line( isset( $t['description'] ) ? $t['description'] : '', 200 ),
			);
		}

		foreach ( (array) $get( 'faqs' ) as $f ) {
			$q = is_array( $f ) ? self::line( isset( $f['question'] ) ? $f['question'] : '', 300 ) : '';
			if ( '' === $q ) {
				continue;
			}
			$out['faqs'][] = array(
				'question' => $q,
				'answer'   => self::text( isset( $f['answer'] ) ? $f['answer'] : '', 3000 ),
			);
		}

		$offer        = is_array( $get( 'offer' ) ) ? $get( 'offer' ) : array();
		$out['offer'] = array(
			'enabled'      => self::flag( isset( $offer['enabled'] ) ? $offer['enabled'] : false ),
			'price'        => self::int( isset( $offer['price'] ) ? $offer['price'] : 0, 0, 100000000 ),
			'comparePrice' => self::int( isset( $offer['comparePrice'] ) ? $offer['comparePrice'] : 0, 0, 100000000 ),
			'validTill'    => self::date( isset( $offer['validTill'] ) ? $offer['validTill'] : '' ),
			'minPax'       => self::int( isset( $offer['minPax'] ) ? $offer['minPax'] : 2, 1, 100 ),
			'note'         => self::line( isset( $offer['note'] ) ? $offer['note'] : '', 300 ),
		);

		return $out;
	}

	/* ─── Publish checks ─────────────────────────────────────────────────── */

	/**
	 * What must be in place before a package can go live. The editor shows
	 * the same list (plus softer suggestions) as a checklist; this server
	 * copy is the backstop that actually holds a package back.
	 *
	 * @return string[] Problems, in plain words. Empty means publishable.
	 */
	public static function publish_errors( array $d, $title ) {
		$errors = array();
		$days   = (int) $d['nights'] + 1;

		if ( '' === trim( (string) $title ) ) {
			$errors[] = __( 'Add a package title.', 'flywings-packages' );
		}
		if ( '' === $d['destination'] ) {
			$errors[] = __( 'Choose a destination.', 'flywings-packages' );
		}
		if ( (int) $d['nights'] < 1 ) {
			$errors[] = __( 'Set the number of nights.', 'flywings-packages' );
		}
		if ( count( $d['images'] ) < 1 ) {
			$errors[] = __( 'Add at least one photo.', 'flywings-packages' );
		}
		if ( '' === trim( $d['overview'] ) ) {
			$errors[] = __( 'Write the overview.', 'flywings-packages' );
		}
		if ( (int) $d['nights'] >= 1 && count( $d['itinerary'] ) !== $days ) {
			/* translators: 1: days in itinerary, 2: days in duration */
			$errors[] = sprintf( __( 'The itinerary has %1$d days but the trip is %2$d days.', 'flywings-packages' ), count( $d['itinerary'] ), $days );
		}
		foreach ( $d['itinerary'] as $i => $day ) {
			if ( '' === $day['title'] ) {
				/* translators: %d: day number */
				$errors[] = sprintf( __( 'Day %d needs a title.', 'flywings-packages' ), $i + 1 );
			}
		}
		if ( count( $d['inclusions'] ) < 1 ) {
			$errors[] = __( 'List what is included.', 'flywings-packages' );
		}
		if ( $d['showPrice'] && ! $d['priceOnRequest'] && (int) $d['startingPrice'] < 1 ) {
			$errors[] = __( 'Enter the starting price, or turn off "Show price on website".', 'flywings-packages' );
		}
		if ( $d['offer']['enabled'] && (int) $d['offer']['price'] < 1 ) {
			$errors[] = __( 'Enter the offer price, or turn the offer off.', 'flywings-packages' );
		}
		return $errors;
	}

	/* ─── Output for the website ─────────────────────────────────────────── */

	/** 100000 -> "₹1,00,000" (Indian digit grouping). 0 -> "". */
	public static function inr( $n ) {
		$n = (int) $n;
		if ( $n <= 0 ) {
			return '';
		}
		$s     = (string) $n;
		$last3 = substr( $s, -3 );
		$rest  = substr( $s, 0, -3 );
		if ( '' !== $rest && false !== $rest ) {
			$rest = preg_replace( '/\B(?=(\d{2})+(?!\d))/', ',', $rest );
			return '₹' . $rest . ',' . $last3;
		}
		return '₹' . $last3;
	}

	/** 5 -> "5 Nights / 6 Days" */
	public static function duration_label( $nights ) {
		$nights = (int) $nights;
		if ( $nights < 1 ) {
			return '';
		}
		$days = $nights + 1;
		return sprintf(
			'%d %s / %d %s',
			$nights,
			1 === $nights ? 'Night' : 'Nights',
			$days,
			'Days'
		);
	}

	public static function today() {
		return current_time( 'Y-m-d' );
	}

	/** Whether the package should appear on listings (packages page, homepage, sitemap). */
	public static function is_listed( array $d ) {
		return $d['listed'] && ! ( $d['availableUntil'] && $d['availableUntil'] < self::today() );
	}

	public static function offer_is_live( array $d ) {
		$o = $d['offer'];
		return $o['enabled'] && (int) $o['price'] > 0 && ( '' === $o['validTill'] || $o['validTill'] >= self::today() );
	}

	/** Image URL for a stored image, preferring the attachment's own (current) URL. */
	private static function image_url( array $img, $size = 'full' ) {
		if ( ! empty( $img['id'] ) ) {
			$url = wp_get_attachment_image_url( (int) $img['id'], $size );
			if ( $url ) {
				return $url;
			}
		}
		return $img['url'];
	}

	private static function strip_excerpt( $text, $max ) {
		$text = trim( preg_replace( '/\s+/u', ' ', $text ) );
		if ( mb_strlen( $text ) <= $max ) {
			return $text;
		}
		$cut = mb_substr( $text, 0, $max );
		$sp  = mb_strrpos( $cut, ' ' );
		return rtrim( mb_substr( $cut, 0, $sp ? $sp : $max ), ' ,.;:' ) . '...';
	}

	/**
	 * The package as the website's PackageData JSON.
	 *
	 * @param WP_Post     $post
	 * @param array|null  $d     Package data (defaults to the saved data).
	 * @param string      $mode  'full' for the detail page, 'list' for cards (heavy sections left empty).
	 */
	public static function to_api( WP_Post $post, $d = null, $mode = 'full' ) {
		$d      = null === $d ? self::get( $post->ID ) : self::merge( $d );
		$full   = 'full' === $mode;
		$title  = html_entity_decode( wp_strip_all_tags( $post->post_title ), ENT_QUOTES, 'UTF-8' );
		$nights = (int) $d['nights'];

		$dest = $d['destination'] ? get_term_by( 'slug', $d['destination'], self::TAX_DEST ) : false;
		$type_names = array();
		foreach ( $d['tripTypes'] as $slug ) {
			$term = get_term_by( 'slug', $slug, self::TAX_TYPE );
			if ( $term ) {
				$type_names[] = self::term_name( $term );
			}
		}

		$images = array();
		$alts   = array();
		foreach ( $d['images'] as $img ) {
			$images[] = self::image_url( $img );
			$alts[]   = '' !== $img['alt'] ? $img['alt'] : $title;
		}
		$card_image = $d['images'] ? self::image_url( $d['images'][0], 'large' ) : '';

		$hotels = array();
		foreach ( $d['hotels'] as $h ) {
			if ( '' === $h['upgradeOption'] ) {
				unset( $h['upgradeOption'] );
			}
			$hotels[] = $h;
		}

		$tiers = array();
		foreach ( $d['pricingTiers'] as $t ) {
			$tiers[] = array(
				'label'         => $t['label'],
				'price'         => self::inr( $t['price'] ),
				'originalPrice' => self::inr( $t['originalPrice'] ),
				'description'   => $t['description'],
			);
		}

		$itinerary = array();
		foreach ( $d['itinerary'] as $i => $day ) {
			$row = array(
				'day'         => $i + 1,
				'title'       => $day['title'],
				'description' => $day['description'],
				'activities'  => $day['activities'],
			);
			if ( '' !== $day['meals'] ) {
				$row['meals'] = $day['meals'];
			}
			if ( '' !== $day['hotel'] ) {
				$row['hotel'] = $day['hotel'];
			}
			$itinerary[] = $row;
		}

		$offer = null;
		if ( self::offer_is_live( $d ) ) {
			$compare = (int) $d['offer']['comparePrice'] ? $d['offer']['comparePrice'] : $d['startingPrice'];
			$days    = array();
			foreach ( $d['itinerary'] as $i => $day ) {
				$days[] = sprintf( 'Day %d: %s', $i + 1, $day['title'] ) . ( '' !== $day['meals'] ? ' (' . $day['meals'] . ')' : '' );
			}
			$offer = array(
				'price'        => self::inr( $d['offer']['price'] ),
				'comparePrice' => (int) $compare > (int) $d['offer']['price'] ? self::inr( $compare ) : '',
				'validTill'    => $d['offer']['validTill'],
				'minPax'       => (int) $d['offer']['minPax'],
				'note'         => $d['offer']['note'],
				'itinerary'    => $days,
			);
		}

		$meta_description = '' !== $d['metaDescription'] ? $d['metaDescription'] : self::strip_excerpt( '' !== $d['tagline'] ? $d['tagline'] : $d['overview'], 155 );

		$out = array(
			'id'                 => $post->ID,
			'slug'               => $post->post_name,
			// UTC with an explicit "Z" (mysql_to_rfc3339 leaves the zone off).
			'modified'           => gmdate( 'Y-m-d\TH:i:s\Z', strtotime( $post->post_modified_gmt . ' UTC' ) ),
			'destinationSlug'    => $d['destination'],
			'destinationName'    => $dest ? self::term_name( $dest ) : '',
			'region'             => $dest && 'india' === get_term_meta( $dest->term_id, self::REGION_META, true ) ? 'india' : 'international',
			'tripTypes'          => $type_names,
			'title'              => $title,
			'shortTitle'         => '' !== $d['shortTitle'] ? $d['shortTitle'] : $title,
			'tagline'            => $d['tagline'],
			'heroImages'         => $images,
			'heroImageAlts'      => $alts,
			'cardImage'          => $card_image,
			'rating'             => (float) $d['rating'],
			'reviewCount'        => (int) $d['reviewCount'],
			'duration'           => self::duration_label( $nights ),
			'nights'             => $nights,
			'days'               => $nights > 0 ? $nights + 1 : 0,
			'destinations'       => $d['cities'],
			'hotelCategory'      => $d['hotelCategory'],
			'transferIncluded'   => (bool) $d['transferIncluded'],
			'mealsIncluded'      => $d['mealsIncluded'],
			'startingPrice'      => $d['priceOnRequest'] ? '' : self::inr( $d['startingPrice'] ),
			'originalPrice'      => $d['priceOnRequest'] ? '' : self::inr( $d['originalPrice'] ),
			'overview'           => $full ? $d['overview'] : self::strip_excerpt( $d['overview'], 300 ),
			'itinerary'          => $full ? $itinerary : array(),
			'inclusions'         => $d['inclusions'],
			'exclusions'         => $full ? $d['exclusions'] : array(),
			'hotels'             => $full ? $hotels : array(),
			'pricingTiers'       => $full && ! $d['priceOnRequest'] ? $tiers : array(),
			'emiAvailable'       => (bool) $d['emiAvailable'],
			'cancellationPolicy' => $full ? $d['cancellationPolicy'] : array(),
			'faqs'               => $full ? $d['faqs'] : array(),
			'relatedSlugs'       => $d['relatedSlugs'],
			'metaTitle'          => '' !== $d['metaTitle'] ? $d['metaTitle'] : $title . ' | Flywings',
			'metaDescription'    => $meta_description,
			'keywords'           => $d['keywords'],
			'showPrice'          => (bool) $d['showPrice'],
			'priceOnRequest'     => (bool) $d['priceOnRequest'],
			'soldOut'            => (bool) $d['soldOut'],
			'listed'             => self::is_listed( $d ),
			'featured'           => (bool) $d['featured'],
			'featuredOrder'      => (int) $d['featuredOrder'],
			'availableUntil'     => $d['availableUntil'],
			'offer'              => $offer,
		);

		if ( '' !== $d['badge'] ) {
			$out['badge'] = $d['badge'];
		}
		if ( '' !== $d['childPrice'] && ! $d['priceOnRequest'] ) {
			$out['childPrice'] = $d['childPrice'];
		}
		if ( $full && '' !== $d['overview'] ) {
			// Paragraphs survive as <p> blocks; the text itself is escaped.
			$out['contentHtml'] = wpautop( esc_html( $d['overview'] ) );
		}
		return $out;
	}

	/* ─── Removed and renamed packages ───────────────────────────────────── */

	/** slug => destination slug for packages that were live and no longer are. */
	public static function gone() {
		$gone = get_option( self::GONE_OPTION, array() );
		return is_array( $gone ) ? $gone : array();
	}

	public static function mark_gone( $slug, $destination ) {
		if ( '' === $slug ) {
			return;
		}
		$gone          = self::gone();
		$gone[ $slug ] = (string) $destination;
		update_option( self::GONE_OPTION, $gone, false );
	}

	public static function unmark_gone( $slug ) {
		$gone = self::gone();
		if ( isset( $gone[ $slug ] ) ) {
			unset( $gone[ $slug ] );
			update_option( self::GONE_OPTION, $gone, false );
		}
	}

	/** A published package by slug, or null. Password-protected packages are treated as unpublished. */
	public static function find_published( $slug ) {
		$posts = get_posts(
			array(
				'post_type'        => self::POST_TYPE,
				'post_status'      => 'publish',
				'name'             => $slug,
				'posts_per_page'   => 1,
				'has_password'     => false,
				'suppress_filters' => true,
			)
		);
		return $posts ? $posts[0] : null;
	}
}
