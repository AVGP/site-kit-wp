/**
 * WordPress dependencies
 */
import { activatePlugin, createURL, visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	deactivateAllOtherPlugins,
	resetSiteKit,
	pasteText,
	setSearchConsoleProperty,
	testClientConfig,
	useRequestInterception,
	setClientConfig,
	setAuthToken,
	setSiteVerification,
} from '../utils';

function stubGoogleSignIn( request ) {
	if ( request.url().startsWith( 'https://accounts.google.com/o/oauth2/auth' ) ) {
		request.respond( {
			status: 302,
			headers: {
				location: createURL( '/', 'oauth2callback=1&code=valid-test-code&e2e-site-verification=1' ),
			},
		} );
	} else if ( request.url().match( 'google-site-kit/v1/modules/search-console/data/matched-sites' ) ) {
		request.respond( {
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify( {
				exactMatch: {
					siteUrl: process.env.WP_BASE_URL,
				},
			} ),
		} );
	} else {
		request.continue();
	}
}

const signOut = async () => {
	await page.waitForSelector( 'button[aria-controls="user-menu"]' );
	await page.click( 'button[aria-controls="user-menu"]' );

	await page.waitForSelector( '#user-menu .mdc-list-item' );
	await page.click( '#user-menu .mdc-list-item' );

	await page.waitForSelector( '.mdc-dialog__container button.mdc-button--danger' );
	await page.click( '.mdc-dialog__container button.mdc-button--danger' );
	await page.waitForNavigation();
};

describe( 'Site Kit set up flow for the first time', () => {
	beforeAll( async () => {
		await activatePlugin( 'e2e-tests-oauth-callback-plugin' );
		await setSearchConsoleProperty();
	} );

	afterEach( async () => {
		await deactivateAllOtherPlugins();
		await resetSiteKit();
	} );

	it( 'authenticates from splash page', async () => {
		await visitAdminPage( 'admin.php', 'page=googlesitekit-splash' );
		await page.waitForSelector( '#client-configuration' );

		await pasteText( '#client-configuration', JSON.stringify( testClientConfig ) );
		await page.click( '#wizard-step-one-proceed' );
		await page.waitForSelector( '.googlesitekit-wizard-step--two .mdc-button' );

		// Sign in with Google
		await page.setRequestInterception( true );
		useRequestInterception( stubGoogleSignIn );
		await page.click( '.googlesitekit-wizard-step--two .mdc-button' );
		await page.waitForNavigation();

		await expect( page ).toMatchElement( '#js-googlesitekit-dashboard' );
		await expect( page ).toMatchElement( '.googlesitekit-publisher-win__title', { text: /Congrats on completing the setup for Site Kit!/i } );
	} );

	it( 'disconnects user from Site Kit', async () => {
		await setClientConfig();
		await setAuthToken();
		await setSiteVerification();
		await setSearchConsoleProperty();
		await visitAdminPage( 'admin.php', 'page=googlesitekit-dashboard' );

		await signOut();

		await expect( page ).toMatchElement(
			'.notice-success',
			{ text: /Successfully disconnected from Site Kit by Google./i }
		);
	} );
} );

