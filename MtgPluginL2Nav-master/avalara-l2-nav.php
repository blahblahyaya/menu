<?php
/**
 * Plugin Name: Avalara L2 Nav
 * Description: top level 2 navigation
 * Version: 0.1
 * Author: Andy Roberts, Avalara
 * Author URI: http://www.avalara.com
 */

// Exit if this wasn't accessed via WordPress (aka via direct access)
if (!defined('ABSPATH')) exit;

// add bootstrap l2 walker
require_once( plugin_dir_path( __FILE__ ) . 'lib/l2_bootstrap_nav_walker.php');

class Avalaral2Nav {
    public function __construct() {
        // Add CSS
        add_action('wp_enqueue_scripts', array($this,'enqueue'));

        //register our Nav(s)
        add_action( 'after_setup_theme', array($this,'register'));

        //add the bootstrap nav template shortcode
        add_shortcode('l2_nav', array($this,'shortcode'));

        //add the wp_nav_menu as a shortcode for use in bootstrap temlplate
        add_shortcode('l2_wp_nav', array($this,'wpNav'));

        // using for [ava_phone] in nav menu will be handy for l2 images etc.
        add_filter('wp_nav_menu_items', 'do_shortcode');

    }
    // register nav/loaction
    public function register() {
        register_nav_menu(  'l2-navigation', __( 'L2 Menu', 'Avada-Avalara' ));
    }

    // render nav shortcode function
    public function shortcode(){
        //bootstarp markup template
    	$template = 'l2-main.twig';

        return Timber::compile($template);
    }

    public function wpNav(){
        // wp_nav_menu to shortcode for use in l2-main.twig
        return
            wp_nav_menu( array(
    		  'theme_location' => 'l2-navigation',
    		  'container' => false,
    		  'menu_class' => '',
    		  'menu_id' => 'l2-nav',
    		  'walker' => new ava_l2_bootstrap_Walker(),
              'echo' =>  false
    		));
        }

    // styles and scripts
    public function enqueue() {
        // nav styles
        wp_enqueue_style('avalara-l2-nav', plugins_url('css/avalara-l2-nav.css', __FILE__), null, '1.0');
        // font awesome
        wp_enqueue_style('avalara-l2-font-awesome', plugins_url('font-awesome-470/css/font-awesome.min.css', __FILE__), null, '1.0');
        // nav js
        wp_enqueue_script('avalara-l2-nav-js', plugins_url('js/avalara-l2-nav.js', __FILE__), array('jquery'), '1.0', true);
    }

}
// Let's do this thing!
$avlrL2Nav = new Avalaral2Nav();
