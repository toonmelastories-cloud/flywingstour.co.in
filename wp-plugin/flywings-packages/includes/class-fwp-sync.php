<?php
/**
 * Keeps the website in step with WordPress.
 *
 * Whenever a live package changes (published, edited, unpublished,
 * trashed) the website's /api/revalidate endpoint is called once at the
 * end of the request, so pages refresh within seconds. Packages that stop
 * being live are remembered with their destination, so their old URL can
 * send visitors (and Google) somewhere useful instead of a 404.
 */

defined( 'ABSPATH' ) || exit;

class FWP_Sync {

	private static $queued = false;

	public static function init() {
		// Fires on every save, including edits to an already published package.
		add_action( 'transition_post_status', array( __CLASS__, 'on_transition' ), 10, 3 );
		// A live package deleted outright (no Trash step) changes no status, so it is caught here.
		add_action( 'before_delete_post', array( __CLASS__, 'on_delete' ), 10, 2 );
	}

	public static function on_delete( $post_id, $post = null ) {
		$post = $post ? $post : get_post( $post_id );
		if ( $post && FWP_Data::POST_TYPE === $post->post_type && 'publish' === $post->post_status ) {
			self::on_transition( 'trash', 'publish', $post );
		}
	}

	public static function on_transition( $new_status, $old_status, $post ) {
		if ( FWP_Data::POST_TYPE !== $post->post_type ) {
			return;
		}
		// Its current slug plus any it had before a rename, so every old link is covered.
		$slugs = array_unique(
			array_filter(
				array_merge(
					array( preg_replace( '/__trashed(-\d+)?$/', '', (string) $post->post_name ) ),
					(array) get_post_meta( $post->ID, '_wp_old_slug' )
				)
			)
		);

		if ( 'publish' === $new_status ) {
			foreach ( $slugs as $slug ) {
				FWP_Data::unmark_gone( $slug );
			}
		} elseif ( 'publish' === $old_status ) {
			$d = FWP_Data::get( $post->ID );
			foreach ( $slugs as $slug ) {
				FWP_Data::mark_gone( $slug, $d['destination'] );
			}
		}

		if ( 'publish' === $new_status || 'publish' === $old_status ) {
			self::queue();
		}
	}

	/** Schedules one refresh for the end of this request, however many saves happen in it. */
	public static function queue() {
		if ( self::$queued ) {
			return;
		}
		self::$queued = true;
		add_action( 'shutdown', array( __CLASS__, 'ping' ) );
	}

	/**
	 * Calls the website's refresh endpoint and records the outcome, which
	 * the editor and the Settings page show.
	 *
	 * @param bool $force Ping even when nothing was queued (the Settings test button).
	 */
	public static function ping( $force = false ) {
		$site   = FWP_Settings::site_url();
		$secret = FWP_Settings::secret();

		if ( '' === $site || '' === $secret ) {
			self::log( false, __( 'website address or refresh secret is not set in Packages > Settings', 'flywings-packages' ) );
			return;
		}

		$response = wp_remote_post(
			$site . '/api/revalidate?secret=' . rawurlencode( $secret ),
			array(
				'timeout'  => $force ? 15 : 6,
				'blocking' => true,
			)
		);

		if ( is_wp_error( $response ) ) {
			self::log( false, $response->get_error_message() );
			return;
		}
		$code = (int) wp_remote_retrieve_response_code( $response );
		if ( 200 === $code ) {
			self::log( true, 'OK' );
		} elseif ( 401 === $code ) {
			self::log( false, __( 'the website rejected the refresh secret', 'flywings-packages' ) );
		} else {
			/* translators: %d: HTTP status code */
			self::log( false, sprintf( __( 'the website answered with HTTP %d', 'flywings-packages' ), $code ) );
		}
	}

	private static function log( $ok, $message ) {
		update_option(
			FWP_Settings::PING_LOG,
			array(
				'time'    => time(),
				'ok'      => (bool) $ok,
				'message' => (string) $message,
			),
			false
		);
	}
}
