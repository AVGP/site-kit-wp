/**
 * External dependencies
 */
import { storiesOf } from '@storybook/react';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import Layout from 'GoogleComponents/layout/layout';
import AdSenseEstimateEarningsWidget
	from 'GoogleModules/adsense/dashboard/dashboard-widget-estimate-earnings';
import AdSensePerformanceWidget from 'GoogleModules/adsense/dashboard/dashboard-widget-performance';
import AdSenseDashboardOutro from 'GoogleModules/adsense/dashboard/dashboard-outro';
/**
 * Internal dependencies
 */
import { googlesitekit as adSenseData } from '../.storybook/data/wp-admin-admin.php-page=googlesitekit-module-adsense-googlesitekit';

storiesOf( 'AdSense Module', module )
	.add( 'Estimate Earnings', () => {
		window.googlesitekit = adSenseData;

		// Load the datacache with data.
		setTimeout( () => {
			wp.hooks.doAction(
				'googlesitekit.moduleLoaded',
				'Single'
			);
		}, 250 );

		return (
			<Layout
				header
				title={ __( 'Estimated earnings', 'google-site-kit' ) }
				headerCtaLabel={ __( 'Advanced Settings', 'google-site-kit' ) }
				headerCtaLink="#"
			>
				<AdSenseEstimateEarningsWidget
					handleDataError={ () => {} }
					handleDataSuccess={ () => {} }
				/>
			</Layout>
		);
	}, {
		options: {
			readySelector: '.googlesitekit-data-block',
		},
	} )
	.add( 'Performance', () => {
		window.googlesitekit = adSenseData;

		// Load the datacache with data.
		setTimeout( () => {
			wp.hooks.doAction(
				'googlesitekit.moduleLoaded',
				'Single'
			);
		}, 250 );

		return (
			<Layout
				header
				title={ __( 'Performance over previous 28 days', 'google-site-kit' ) }
				headerCtaLabel={ __( 'Advanced Settings', 'google-site-kit' ) }
				headerCtaLink="#"
			>
				<AdSensePerformanceWidget />
			</Layout>
		);
	} )
	.add( 'AdSense Outro', () => (
		<AdSenseDashboardOutro />
	) );
