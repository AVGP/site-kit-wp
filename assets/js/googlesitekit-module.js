/**
 * Module component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import ProgressBar from 'GoogleComponents/progress-bar';
import Notification from 'GoogleComponents/notifications/notification';
import { Suspense as ReactSuspense, lazy as ReactLazy } from 'react';

// Load the data module.
/**
 * Internal dependencies
 */
import 'GoogleComponents/data';

/**
 * Internal dependencies.
 */
import ModuleApp from './components/module-app';

/**
 * WordPress dependencies
 */
import { setLocaleData } from '@wordpress/i18n';
import { doAction, applyFilters } from '@wordpress/hooks';
import { Component, render, Fragment } from '@wordpress/element';
let { Suspense, lazy } = wp.element;

// Check for `Suspense` and `lazy` in `wp.element`; versions before 2.4.0 did
// not include either, so we need to fallback to the React versions. See:
// https://github.com/WordPress/gutenberg/blob/master/packages/element/CHANGELOG.md#240-2019-05-21
if ( ! Suspense ) {
	Suspense = ReactSuspense;
}
if ( ! lazy ) {
	lazy = ReactLazy;
}

class GoogleSitekitModule extends Component {
	constructor( props ) {
		super( props );
		this.state = { hasError: false };

		// Set up translations.
		setLocaleData( googlesitekit.locale, 'google-site-kit' );

		const {
			showModuleSetupWizard,
		} = googlesitekit.setup;

		this.state = {
			showModuleSetupWizard,
		};
	}

	componentDidCatch( error, info ) {
		this.setState( {
			hasError: true,
			error,
			info,
		} );
	}

	render() {
		const {
			hasError,
			error,
			info,
			showModuleSetupWizard,
		} = this.state;

		if ( hasError ) {
			return <Notification
				id={ 'googlesitekit-error' }
				key={ 'googlesitekit-error' }
				title={ error }
				description={ info.componentStack }
				dismiss={ '' }
				isDismissable={ false }
				format="small"
				type="win-error"
			/>;
		}

		const { currentAdminPage } = googlesitekit.admin;

		/**
		 * Filters whether to show the Module setup wizard when showModuleSetupWizard is true.
		 *
		 * Modules can opt out of the wizard setup flow by returning false.
		 */
		const moduleHasSetupWizard = applyFilters( 'googlesitekit.moduleHasSetupWizard', true, currentAdminPage );

		if ( showModuleSetupWizard && moduleHasSetupWizard ) {
			// Set webpackPublicPath on-the-fly.
			if ( window.googlesitekit && window.googlesitekit.publicPath ) {
				// eslint-disable-next-line no-undef
				__webpack_public_path__ = window.googlesitekit.publicPath; /*eslint camelcase: 0*/
			}

			const Setup = lazy( () => import( /* webpackChunkName: "chunk-googlesitekit-setup-wrapper" */'./components/setup/setup-wrapper' ) );

			return (
				<Suspense fallback={
					<Fragment>
						<div className="googlesitekit-setup">
							<div className="mdc-layout-grid">
								<div className="mdc-layout-grid__inner">
									<div className="
										mdc-layout-grid__cell
										mdc-layout-grid__cell--span-12
									">
										<div className="googlesitekit-setup__wrapper">
											<div className="mdc-layout-grid">
												<div className="mdc-layout-grid__inner">
													<div className="
														mdc-layout-grid__cell
														mdc-layout-grid__cell--span-12
													">
														<ProgressBar />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Fragment>
				}>
					<Setup />
				</Suspense>
			);
		}

		return (
			<ModuleApp />
		);
	}
}

// Initialize the app once the DOM is ready.
wp.domReady( function() {
	const siteKitModule = document.getElementById( 'js-googlesitekit-module' );
	if ( null !== siteKitModule ) {
		// Render the Dashboard App.
		render( <GoogleSitekitModule />, siteKitModule );

		/**
		 * Action triggered when the dashboard App is loaded.
		 */
		doAction( 'googlesitekit.moduleLoaded', 'Single', googlesitekitCurrentModule );
	}
} );

