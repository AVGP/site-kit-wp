/**
 * Internal dependencies
 */
import { findTagInHtmlContent } from '../';

const valuesToTest = [
	[
		'<script src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y" async type="text/javascript"></script>',
		'analytics',
		'UA-XXXXX-Y',
	],
	[
		'<script> window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date; ga(\'create\', \'UA-XXXXX-Y\', \'auto\'); ga(\'send\', \'pageview\'); </script><script async src=\'https://www.google-analytics.com/analytics.js\'></script>',
		'analytics',
		'UA-XXXXX-Y',
	],
	[
		'<script> (function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,\'script\',\'https://www.google-analytics.com/analytics.js\',\'ga\'); ga(\'create\', \'UA-XXXXX-Y\', \'auto\'); ga(\'send\', \'pageview\'); </script>',
		'analytics',
		'UA-XXXXX-Y',
	],
	[
		'<meta charset="UTF-8"><title>Site Kit for WordPress</title><link rel="dns-prefetch" href="//fonts.googleapis.com"></link>',
		'analytics',
		false,
	],
	[
		'<amp-analytics type="googleanalytics"><script type="application/json"> { "vars": { "account": "UA-XXXXX-Y" }, "triggers": { "default pageview": { "on": "visible", "request": "pageview", "vars": { "title": "Name of the Article" } } } } </script></amp-analytics>',
		'analytics',
		'UA-XXXXX-Y',
	],
	[
		'<amp-analytics type="gtag" data-credentials="include"><script type="application/json">{"vars" : {"gtag_id": "UA-XXXXX-Y","config" : {"UA-XXXXX-Y": { "groups": "default" } } } }</script>',
		'analytics',
		'UA-XXXXX-Y',
	],
	[
		'<meta charset="UTF-8"><title>Site Kit for WordPress</title><link rel="dns-prefetch" href="//fonts.googleapis.com"></link>',
		'adsense',
		false,
	],
	[
		'<script async src="http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> <script> (adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: "ca-pub-123456789", enable_page_level_ads: true }); </script>',
		'adsense',
		'ca-pub-123456789',
	],
	[
		'<amp-auto-ads type="adsense" data-ad-client="ca-pub-123456789"></amp-auto-ads>',
		'adsense',
		'ca-pub-123456789',
	],
];

describe( 'findTagInHtmlContent', () => {
	it.each( valuesToTest )( 'for HTML %s and module %s should find tag %s', ( html, module, expected ) => {
		expect( findTagInHtmlContent( html, module ) ).toStrictEqual( expected );
	} );
} );
