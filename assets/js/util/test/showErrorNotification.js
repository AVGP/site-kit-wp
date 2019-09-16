/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { showErrorNotification } from '../';

describe( 'showErrorNotification', () => {
	it( 'returns function', () => {
		showErrorNotification();
		const value = applyFilters( 'googlesitekit.ErrorNotification', [] );
		expect( typeof value ).toBe( 'function' );
	} );
} );
