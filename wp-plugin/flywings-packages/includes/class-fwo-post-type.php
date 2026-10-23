<?php
/**
 * The "Offers" menu: the offer post type and its list screen.
 *
 * Offers sit in their own menu next to Packages rather than inside it,
 * because the two are edited by the same people at different moments:
 * a package is written once and kept, an offer arrives on a rate sheet
 * and is gone in a month.
 */

defined( 'ABSPATH' ) || exit;

class FWO_Post_Type {

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );

		add_filter( 'manage_' . FWO_Data::POST_TYPE . '_posts_columns', array( __CLASS__, 'columns' ) );
		add_action( 'manage_' . FWO_Data::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'column_value' ), 10, 2 );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_post_fwo_duplicate', array( __CLASS__, 'duplicate' ) );
		add_filter( 'post_updated_messages', array( __CLASS__, 'messages' ) );
		add_filter( 'enter_title_here', array( __CLASS__, 'title_placeholder' ), 10, 2 );
	}

	public static function register() {
		register_post_type(
			FWO_Data::POST_TYPE,
			array(
				'labels'              => array(
					'name'               => __( 'Offers', 'flywings-packages' ),
					'singular_name'      => __( 'Offer', 'flywings-packages' ),
					'menu_name'          => __( 'Offers', 'flywings-packages' ),
					'all_items'          => __( 'All Offers', 'flywings-packages' ),
					'add_new'            => __( 'Add Offer', 'flywings-packages' ),
					'add_new_item'       => __( 'Add New Offer', 'flywings-packages' ),
					'edit_item'          => __( 'Edit Offer', 'flywings-packages' ),
					'new_item'           => __( 'New Offer', 'flywings-packages' ),
					'search_items'       => __( 'Search Offers', 'flywings-packages' ),
					'not_found'          => __( 'No offers yet. Click "Add Offer" to create the first one.', 'flywings-packages' ),
					'not_found_in_trash' => __( 'No offers in the trash.', 'flywings-packages' ),
				),
				// The website renders offers; WordPress only stores them.
				'public'              => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_admin_bar'   => true,
				'show_in_rest'        => false,
				'menu_position'       => 22,
				'menu_icon'           => 'dashicons-tag',
				'supports'            => array( 'title', 'revisions', 'author' ),
				// Editors and administrators manage offers; authors and contributors do not.
				'capability_type'     => 'page',
				'map_meta_cap'        => true,
				'hierarchical'        => false,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'exclude_from_search' => true,
			)
		);
	}

	public static function title_placeholder( $text, $post ) {
		if ( $post && FWO_Data::POST_TYPE === $post->post_type ) {
			return __( 'Offer name, e.g. Hanoi, Halong Bay & Ninh Binh 5 Days', 'flywings-packages' );
		}
		return $text;
	}

	/* ─── List screen ────────────────────────────────────────────────────── */

	public static function columns( $columns ) {
		$out = array();
		foreach ( $columns as $key => $label ) {
			$out[ $key ] = $label;
			if ( 'title' === $key ) {
				$out['fwo_region']    = __( 'Region', 'flywings-packages' );
				$out['fwo_price']     = __( 'From', 'flywings-packages' );
				$out['fwo_validTill'] = __( 'Held until', 'flywings-packages' );
				$out['fwo_state']     = __( 'On the website', 'flywings-packages' );
			}
		}
		return $out;
	}

	public static function column_value( $column, $post_id ) {
		$d = FWO_Data::get( $post_id );
		switch ( $column ) {
			case 'fwo_region':
				echo esc_html( $d['region'] ? $d['region'] : '—' );
				break;
			case 'fwo_price':
				echo esc_html( $d['startingPrice'] ? FWP_Data::inr( $d['startingPrice'] ) : '—' );
				break;
			case 'fwo_validTill':
				if ( '' === $d['validTill'] ) {
					echo '<span style="color:#646970">' . esc_html__( 'no end date', 'flywings-packages' ) . '</span>';
				} else {
					$past = $d['validTill'] < FWP_Data::today();
					printf(
						'<span style="color:%s">%s</span>',
						$past ? '#b32d2e' : '#1d2327',
						esc_html( mysql2date( 'j M Y', $d['validTill'] . ' 00:00:00' ) )
					);
				}
				break;
			case 'fwo_state':
				$published = 'publish' === get_post_status( $post_id );
				if ( ! $published ) {
					echo '<span style="color:#646970">' . esc_html__( 'not published', 'flywings-packages' ) . '</span>';
				} elseif ( ! $d['listed'] ) {
					echo '<span style="color:#646970">' . esc_html__( 'hidden', 'flywings-packages' ) . '</span>';
				} elseif ( ! FWO_Data::is_live( $d ) ) {
					echo '<span style="color:#b32d2e">' . esc_html__( 'expired', 'flywings-packages' ) . '</span>';
				} else {
					echo '<span style="color:#008a20">' . esc_html__( 'showing', 'flywings-packages' ) . '</span>';
				}
				break;
		}
	}

	/* ─── Duplicate ──────────────────────────────────────────────────────── */

	public static function duplicate_url( $post_id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=fwo_duplicate&post=' . (int) $post_id ),
			'fwo_duplicate_' . (int) $post_id
		);
	}

	public static function row_actions( $actions, $post ) {
		if ( FWO_Data::POST_TYPE === $post->post_type && current_user_can( 'edit_post', $post->ID ) ) {
			$actions['fwo_duplicate'] = sprintf(
				'<a href="%s">%s</a>',
				esc_url( self::duplicate_url( $post->ID ) ),
				esc_html__( 'Duplicate', 'flywings-packages' )
			);
		}
		return $actions;
	}

	/** Copies an offer as a draft, which is how next season's rate usually starts. */
	public static function duplicate() {
		$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
		check_admin_referer( 'fwo_duplicate_' . $post_id );

		$post = get_post( $post_id );
		if ( ! $post || FWO_Data::POST_TYPE !== $post->post_type || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_die( esc_html__( 'You cannot duplicate this offer.', 'flywings-packages' ) );
		}

		$new_id = wp_insert_post(
			array(
				'post_type'   => FWO_Data::POST_TYPE,
				'post_status' => 'draft',
				/* translators: %s: offer name */
				'post_title'  => sprintf( __( '%s (copy)', 'flywings-packages' ), $post->post_title ),
				'post_author' => get_current_user_id(),
			),
			true
		);
		if ( is_wp_error( $new_id ) ) {
			wp_die( esc_html( $new_id->get_error_message() ) );
		}

		update_post_meta( $new_id, FWO_Data::META, wp_slash( FWO_Data::get( $post_id ) ) );
		wp_safe_redirect( admin_url( 'post.php?post=' . $new_id . '&action=edit' ) );
		exit;
	}

	public static function messages( $messages ) {
		$messages[ FWO_Data::POST_TYPE ] = array(
			0  => '',
			1  => __( 'Offer updated. It is on the website within a few seconds.', 'flywings-packages' ),
			2  => __( 'Custom field updated.', 'flywings-packages' ),
			3  => __( 'Custom field deleted.', 'flywings-packages' ),
			4  => __( 'Offer updated.', 'flywings-packages' ),
			5  => __( 'Offer restored to an earlier version.', 'flywings-packages' ),
			6  => __( 'Offer published. It is on the website within a few seconds.', 'flywings-packages' ),
			7  => __( 'Offer saved as a draft. It is not on the website yet.', 'flywings-packages' ),
			8  => __( 'Offer submitted.', 'flywings-packages' ),
			9  => __( 'Offer scheduled.', 'flywings-packages' ),
			10 => __( 'Draft updated.', 'flywings-packages' ),
		);
		return $messages;
	}
}
