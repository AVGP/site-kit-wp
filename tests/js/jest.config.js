module.exports = {
	rootDir: '../../',
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
	testMatch: [
		'<rootDir>/assets/**/__tests__/**/*.js',
		'<rootDir>/assets/**/test/*.js',
		'<rootDir>/assets/**/?(*.)test.js',
	],
	testPathIgnorePatterns: [
		'<rootDir>/.git',
		'<rootDir>/node_modules',
		'<rootDir>/build',
	],
	// Matches aliases in webpack.config.js.
	moduleNameMapper: {
		'^SiteKitCore/(.*)$': '<rootDir>assets/js/$1.js',
		'^GoogleComponents/(.*)$': '<rootDir>assets/js/components/$1.js',
		'^GoogleUtil/(.*)$': '<rootDir>assets/js/util/$1.js',
		'^GoogleModules/(.*)$': '<rootDir>assets/js/modules/$1.js',
	},
	coveragePathIgnorePatterns: [ '/node_modules/', '<rootDir>/build/' ],
	coverageReporters: [ 'lcov' ],
	coverageDirectory: '<rootDir>/build/logs',
};
