<?php
/**
 * The offer record: its default shape, how submitted values are
 * cleaned, the publish checks, and the JSON the website reads.
 *
 * An offer is a rate the office is quoting now for a trip that has no
 * package page of its own: the Vietnam circuits, a one-off Bali rate, a
 * supplier's Kuala Lumpur price. A package that goes on offer does not
 * belong here; that is the package editor's "Visibility & Offer" tab,
 * which already puts it on the Offers page.
 *
 * Everything an offer holds lives in one post meta array (META) so a
 * save is atomic and a revision restores the whole offer. The title and
 * URL anchor are the post's own title and post_name.
 *
 * The JSON from to_api() mirrors the website's QuotedPackage type in
 * src/data/quotedPackages.ts, so the existing card design renders it as
 * is. The sanitising and formatting helpers come from FWP_Data, so the
 * two records clean their values the same way.
 */

defined( 'ABSPATH' ) || exit;

class FWO_Data {

	const POST_TYPE = 'fw_offer';
	const META      = '_fwo_data';

	public static function defaults() {
		return array(
			'region'        => '',
			'duration'      => '',
			'cities'        => array(),
			'hotelCategory' => '',
			'startingPrice' => 0,
			'minPax'        => 2,
			'itinerary'     => array(),
			'inclusions'    => array(),
			'image'         => array(
				'id'  => 0,
				'url' => '',
				'alt' => '',
			),
			'compare'       => self::compare_defaults(),
			'validTill'     => '',
			'listed'        => true,
		);
	}

	/**
	 * The package this rate undercuts.
	 *
	 * `sameTrip` is the honest-saving switch. On, the card prints the
	 * package price struck out with the difference as a saving; off, it
	 * only points at the other package, because calling a shorter
	 * holiday a saving would be a discount nobody has given.
	 */
	public static function compare_defaults() {
		return array(
			'enabled'  => false,
			'label'    => '',
			'price'    => 0,
			'href'     => '',
			'sameTrip' => false,
			'note'     => '',
		);
	}

	/**
	 * A brand new offer.
	 *
	 * Unlike a package this starts with an empty inclusion list rather
	 * than a standard one: an offer's inclusions come off a supplier's
	 * rate sheet and differ every time. The editor still offers the
	 * quick-add chips from Packages > Settings.
	 */
	public static function new_offer_defaults() {
		return self::defaults();
	}

	public static function get( $post_id ) {
		$saved = get_post_meta( $post_id, self::META, true );
		return self::merge( is_array( $saved ) ? $saved : array() );
	}

	/** Saved data merged over defaults, so older records gain new fields safely. */
	public static function merge( array $saved ) {
		$d            = array_merge( self::defaults(), $saved );
		$d['compare'] = array_merge( self::compare_defaults(), is_array( $d['compare'] ) ? $d['compare'] : array() );
		$d['image']   = array_merge( self::defaults()['image'], is_array( $d['image'] ) ? $d['image'] : array() );
		return $d;
	}

	/* ─── Cleaning ───────────────────────────────────────────────────────── */

	public static function sanitize( $raw ) {
		$raw = is_array( $raw ) ? $raw : array();
		$get = function ( $key, $default = '' ) use ( $raw ) {
			return isset( $raw[ $key ] ) ? $raw[ $key ] : $default;
		};

		$image_raw = is_array( $get( 'image', array() ) ) ? $get( 'image', array() ) : array();
		$image     = array(
			'id'  => FWP_Data::int( isset( $image_raw['id'] ) ? $image_raw['id'] : 0 ),
			'url' => esc_url_raw( (string) ( isset( $image_raw['url'] ) ? $image_raw['url'] : '' ) ),
			'alt' => FWP_Data::line( isset( $image_raw['alt'] ) ? $image_raw['alt'] : '' ),
		);

		$compare_raw = is_array( $get( 'compare', array() ) ) ? $get( 'compare', array() ) : array();
		$compare     = array(
			'enabled'  => FWP_Data::flag( isset( $compare_raw['enabled'] ) ? $compare_raw['enabled'] : false ),
			'label'    => FWP_Data::line( isset( $compare_raw['label'] ) ? $compare_raw['label'] : '' ),
			'price'    => FWP_Data::int( isset( $compare_raw['price'] ) ? $compare_raw['price'] : 0 ),
			'href'     => self::internal_path( isset( $compare_raw['href'] ) ? $compare_raw['href'] : '' ),
			'sameTrip' => FWP_Data::flag( isset( $compare_raw['sameTrip'] ) ? $compare_raw['sameTrip'] : false ),
			'note'     => FWP_Data::line( isset( $compare_raw['note'] ) ? $compare_raw['note'] : '', 400 ),
		);

		return array(
			'region'        => FWP_Data::line( $get( 'region' ), 80 ),
			'duration'      => FWP_Data::line( $get( 'duration' ), 60 ),
			'cities'        => FWP_Data::lines( $get( 'cities', array() ), 12, 80 ),
			'hotelCategory' => FWP_Data::line( $get( 'hotelCategory' ), 80 ),
			'startingPrice' => FWP_Data::int( $get( 'startingPrice', 0 ), 0, 100000000 ),
			'minPax'        => FWP_Data::int( $get( 'minPax', 2 ), 1, 99 ),
			'itinerary'     => FWP_Data::lines( $get( 'itinerary', array() ), 30, 300 ),
			'inclusions'    => FWP_Data::lines( $get( 'inclusions', array() ), 40, 300 ),
			'image'         => $image,
			'compare'       => $compare,
			'validTill'     => FWP_Data::date( $get( 'validTill' ) ),
			'listed'        => FWP_Data::flag( $get( 'listed', true ) ),
		);
	}

	/**
	 * A path on our own site, or "".
	 *
	 * The comparison link exists so a visitor can check the saving for
	 * themselves, which only works if it stays on the site; an offsite
	 * URL here would be a link out of a page built to convert.
	 */
	public static function internal_path( $v ) {
		$v = trim( (string) $v );
		if ( '' === $v ) {
			return '';
		}
		$site = FWP_Settings::site_url();
		if ( '' !== $site && 0 === strpos( $v, $site ) ) {
			$v = substr( $v, strlen( $site ) );
		}
		if ( 0 !== strpos( $v, '/' ) || 0 === strpos( $v, '//' ) ) {
			return '';
		}
		return esc_url_raw( $v, array( 'http', 'https' ) );
	}

	/* ─── Publish checks ─────────────────────────────────────────────────── */

	/**
	 * What must be right before this offer can go on the website.
	 *
	 * Keep in step with runChecks() in src/offer-admin.jsx, which shows
	 * the same list in the editor before a save is attempted.
	 *
	 * @return array[] { field, tab, message }
	 */
	public static function publish_errors( array $d, $title ) {
		$errors = array();
		$add    = function ( $field, $tab, $message ) use ( &$errors ) {
			$errors[] = array(
				'field'   => $field,
				'tab'     => $tab,
				'message' => $message,
			);
		};

		if ( '' === trim( (string) $title ) ) {
			$add( 'title', 'basics', __( 'Give the offer a name, for example "Hanoi, Halong Bay & Ninh Binh 5 Days".', 'flywings-packages' ) );
		}
		if ( '' === $d['region'] ) {
			$add( 'region', 'basics', __( 'Say which country or region this is, for example "Vietnam".', 'flywings-packages' ) );
		}
		if ( '' === $d['duration'] ) {
			$add( 'duration', 'basics', __( 'Say how long the trip is, for example "4 Nights / 5 Days".', 'flywings-packages' ) );
		}
		if ( $d['startingPrice'] <= 0 ) {
			$add( 'startingPrice', 'pricing', __( 'Add the starting price per person. An offer with no price is not an offer.', 'flywings-packages' ) );
		}
		if ( ! $d['inclusions'] ) {
			$add( 'inclusions', 'details', __( 'List what the rate includes. Visitors will not enquire without it.', 'flywings-packages' ) );
		}
		if ( $d['validTill'] && $d['validTill'] < FWP_Data::today() ) {
			$add( 'validTill', 'pricing', __( 'The hold date has already passed, so this offer would never show. Clear it or move it forward.', 'flywings-packages' ) );
		}
		if ( $d['compare']['enabled'] ) {
			if ( '' === $d['compare']['label'] ) {
				$add( 'compareLabel', 'pricing', __( 'Name what this rate is compared with, for example "our Kuala Lumpur 3N/4D package".', 'flywings-packages' ) );
			}
			if ( $d['compare']['price'] <= 0 ) {
				$add( 'comparePrice', 'pricing', __( 'Add the price being compared against, or switch the comparison off.', 'flywings-packages' ) );
			}
			if ( '' === $d['compare']['href'] ) {
				$add( 'compareHref', 'pricing', __( 'Add the link to the page being compared with, so a visitor can check the figure. It must be a page on this website.', 'flywings-packages' ) );
			}
			if ( $d['compare']['sameTrip'] && $d['compare']['price'] > 0 && $d['compare']['price'] <= $d['startingPrice'] ) {
				$add( 'comparePrice', 'pricing', __( 'The compared price is not higher than this offer, so there is no saving to show.', 'flywings-packages' ) );
			}
		}
		return $errors;
	}

	/** Suggestions. Worth fixing, but they do not block publishing. */
	public static function publish_warnings( array $d ) {
		$warnings = array();
		if ( '' === $d['image']['url'] ) {
			$warnings[] = __( 'No photo, so the card shows a plain panel. Add one if we hold a picture of the place.', 'flywings-packages' );
		} elseif ( '' === $d['image']['alt'] ) {
			$warnings[] = __( 'The photo has no description, which screen readers and Google both read.', 'flywings-packages' );
		}
		if ( ! $d['itinerary'] ) {
			$warnings[] = __( 'No day-by-day. Offers that show the days get more enquiries than ones that do not.', 'flywings-packages' );
		}
		if ( ! $d['cities'] ) {
			$warnings[] = __( 'No cities listed, so the card cannot say where the trip goes.', 'flywings-packages' );
		}
		if ( '' === $d['hotelCategory'] ) {
			$warnings[] = __( 'No hotel category, for example "3 Star" or "Hotel, category on request".', 'flywings-packages' );
		}
		if ( ! $d['validTill'] ) {
			$warnings[] = __( 'No hold date. The offer will stay up until someone takes it down by hand.', 'flywings-packages' );
		}
		return $warnings;
	}

	/* ─── Output for the website ─────────────────────────────────────────── */

	/** Live on the website: listed, and not past its hold date. */
	public static function is_live( array $d ) {
		if ( ! $d['listed'] ) {
			return false;
		}
		if ( $d['validTill'] && $d['validTill'] < FWP_Data::today() ) {
			return false;
		}
		return true;
	}

	private static function image_url( array $image ) {
		if ( $image['id'] ) {
			$src = wp_get_attachment_image_src( (int) $image['id'], 'full' );
			if ( $src ) {
				return $src[0];
			}
		}
		return $image['url'];
	}

	/**
	 * The offer as the website's QuotedPackage type.
	 *
	 * Optional members are left out rather than sent empty, because the
	 * card treats "no photo" and "no comparison" as meaningfully
	 * different from an empty string.
	 */
	public static function to_api( WP_Post $post, $d = null ) {
		$d   = null === $d ? self::get( $post->ID ) : $d;
		$out = array(
			'slug'          => $post->post_name,
			'name'          => html_entity_decode( get_the_title( $post ), ENT_QUOTES, 'UTF-8' ),
			'region'        => $d['region'],
			'duration'      => $d['duration'],
			'cities'        => array_values( $d['cities'] ),
			'hotelCategory' => $d['hotelCategory'],
			'startingPrice' => FWP_Data::inr( $d['startingPrice'] ),
			'minPax'        => (int) $d['minPax'],
			'itinerary'     => array_values( $d['itinerary'] ),
			'inclusions'    => array_values( $d['inclusions'] ),
		);

		$image = self::image_url( $d['image'] );
		if ( '' !== $image ) {
			$out['image']    = $image;
			$out['imageAlt'] = '' !== $d['image']['alt'] ? $d['image']['alt'] : $out['name'];
		}

		$c = $d['compare'];
		if ( $c['enabled'] && $c['price'] > 0 && '' !== $c['label'] && '' !== $c['href'] ) {
			$out['compareWith'] = array(
				'label'    => $c['label'],
				'price'    => FWP_Data::inr( $c['price'] ),
				'href'     => $c['href'],
				'sameTrip' => (bool) $c['sameTrip'],
			);
			if ( '' !== $c['note'] ) {
				$out['compareWith']['note'] = $c['note'];
			}
		}

		if ( '' !== $d['validTill'] ) {
			$out['validTill'] = $d['validTill'];
		}
		return $out;
	}
}
