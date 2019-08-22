/**
 * Internal dependencies
 */
import { getQueryParameter } from '../';

const valuesToTest = [
	[
		'?foo=bar&x=1',
		'foo',
		'bar'
	],
	[
		'?bar=foo&x=1',
		'bar',
		'foo'
	],
	[
		'?foo=bar&x=1',
		'x',
		'1'
	],
	[
		'?foo=bar&y=2&x=1',
		'y',
		'2'
	]
];

// Disable reason: Needs investigation.
// eslint-disable-next-line jest/no-disabled-tests
describe.skip( 'getQueryParameter', () => {
	it.each( valuesToTest )( 'given search string %s and key %s, should return %s', ( search, param, expected ) => {
		// eslint-disable-next-line no-undef
		global.location = { href: 'https://example.com' };
		expect( getQueryParameter( search, param ) ).toStrictEqual( expected );
	} );
} );
