<?php
/**
 * Plugin Name:       Flywings Packages
 * Description:       Add and edit tour packages in WordPress. Each package appears on flywingstour.co.in in the site's own design: the packages page, its own detail page, the homepage (when featured) and the offers page (when on offer).
 * Version:           1.0.1
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Flywings Tour & Packages Pvt Ltd
 * License:           GPL-2.0-or-later
 * Text Domain:       flywings-packages
 */

defined( 'ABSPATH' ) || exit;

define( 'FWP_VERSION', '1.0.1' );
define( 'FWP_FILE', __FILE__ );
define( 'FWP_DIR', plugin_dir_path( __FILE__ ) );
define( 'FWP_URL', plugin_dir_url( __FILE__ ) );

require_once FWP_DIR . 'includes/class-fwp-settings.php';
require_once FWP_DIR . 'includes/class-fwp-data.php';
require_once FWP_DIR . 'includes/class-fwp-post-type.php';
require_once FWP_DIR . 'includes/class-fwp-sync.php';
require_once FWP_DIR . 'includes/class-fwp-rest.php';
require_once FWP_DIR . 'includes/class-fwp-admin.php';

FWP_Post_Type::init();
FWP_Sync::init();
FWP_Rest::init();
FWP_Settings::init();

if ( is_admin() ) {
	FWP_Admin::init();
}

register_activation_hook( __FILE__, array( 'FWP_Post_Type', 'activate' ) );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
