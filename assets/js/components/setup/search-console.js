/**
 * SearchConsole component.
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
import data from 'GoogleComponents/data';
import ProgressBar from 'GoogleComponents/progress-bar';
import { Select, TextField, Input } from 'SiteKitCore/material-components';
import PropTypes from 'prop-types';
import Button from 'SiteKitCore/components/button';
import HelpLink from 'GoogleComponents/help-link';
import { sendAnalyticsTrackingEvent } from 'GoogleUtil';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';

class SearchConsole extends Component {
	constructor( props ) {
		super( props );

		const { siteURL } = googlesitekit.admin;

		this.state = {
			loading: true,
			sites: false,
			selectedUrl: siteURL,
			siteURL,
			connected: false,
			errorCode: false,
			errorMsg: '',
		};

		this.handleUrlSelect = this.handleUrlSelect.bind( this );
		this.insertPropertyToSearchConsole = this.insertPropertyToSearchConsole.bind( this );
		this.submitPropertyEventHandler = this.submitPropertyEventHandler.bind( this );
	}

	async componentDidMount() {
		const { isAuthenticated, shouldSetup } = this.props;

		if ( ! isAuthenticated || ! shouldSetup ) {
			return;
		}

		try {
			const isSiteExist = await data.get( 'modules', 'search-console', 'is-site-exist' );
			if ( isSiteExist && true === isSiteExist.verified ) {
				const savePropertyResponse = await data.set( 'modules', 'search-console', 'save-property', { siteURL: isSiteExist.siteURL } );
				if ( true === savePropertyResponse.status ) {
					return this.props.searchConsoleSetup( isSiteExist.siteURL );
				}
			}

			// Fallback to request match sites and exact match site.
			this.requestSearchConsoleSiteList();
		} catch {
			// Fallback to request match sites and exact match site.
			this.requestSearchConsoleSiteList();
		}
	}

	/**
	 * Request match sites and exact match site to search console API services
	 */
	requestSearchConsoleSiteList() {
		const { errorCode } = this.state;
		if ( errorCode ) {
			return;
		}
		const { setErrorMessage } = this.props;
		( async () => {
			try {
				const sitePropertyData = await data.get( 'modules', 'search-console', 'matched-sites' );

				// We found exact match, continue the process in the background.
				if ( sitePropertyData.exact_match ) {
					const siteURL = sitePropertyData.exact_match;
					await this.insertPropertyToSearchConsole( siteURL );

					// We have everything we need here. go to next step.
					this.props.searchConsoleSetup( siteURL );

					return;
				}

				let errorMessage = '';
				if ( 1 < sitePropertyData.property_matches.length ) {
					errorMessage = sprintf( __( 'We found %d existing accounts. We recommend using the account  “%s”. Please confirm or change below to use.', 'google-site-kit' ), sitePropertyData.property_matches.length, sitePropertyData.property_matches[ 0 ] );
				} else {
					errorMessage = __( 'We found no verified accounts, would you like to verify this URL?', 'google-site-kit' );
				}

				setErrorMessage( errorMessage );
				this.setState( {
					loading: false,
					sites: sitePropertyData.property_matches,
					errorCode: 'no_property_matched',
					errorMsg: errorMessage,
				} );
			} catch ( err ) {
				setErrorMessage( err.message );
				this.setState( {
					loading: false,
					errorCode: err.code,
					errorMsg: err.message,
				} );
			}
		} )();
	}

	/**
	 * Insert siteURL to the option through the API
	 * @param { string } siteURL
	 */
	async insertPropertyToSearchConsole( siteURL ) {
		const response = await data.set( 'modules', 'search-console', 'insert', { siteURL } );
		sendAnalyticsTrackingEvent( 'search_console_setup', 'add_new_sc_property' );

		this.setState( {
			loading: false,
			connected: true,
			sites: response.sites,
		} );
	}

	/**
	 * Event handler to set site url to option.
	 */
	submitPropertyEventHandler() {
		const siteURL = this.state.selectedUrl;
		const { setErrorMessage } = this.props;

		( async () => {
			try {
				await this.insertPropertyToSearchConsole( siteURL );

				setErrorMessage( '' );
				this.props.searchConsoleSetup( siteURL );
			} catch ( err ) {
				setErrorMessage( err.message[ 0 ].message );
				this.setState( {
					loading: false,
					errorCode: err.code,
					errorMsg: err.message[ 0 ].message,
				} );
			}
		} )();
	}

	handleUrlSelect( index, item ) {
		this.setState( {
			selectedUrl: item.getAttribute( 'data-value' ),
		} );
	}

	matchedForm() {
		const { sites, selectedUrl } = this.state;

		const sitesList = [
			{ /* Required for initial placeholder. */
				label: '',
				value: '',
				disabled: true,
			},
		];

		if ( ! sites ) {
			return null;
		}

		sites.forEach( function( site ) {
			sitesList.push( {
				label: site,
				value: site,
			} );
		} );

		return (
			<Fragment>
				<div className="googlesitekit-setup-module__inputs">
					<Select
						enhanced
						name="siteProperty"
						label={ __( 'Choose URL', 'google-site-kit' ) }
						outlined
						onEnhancedChange={ this.handleUrlSelect }
						options={ sitesList }
						value={ selectedUrl }
					/>
				</div>
				<div className="googlesitekit-setup-module__action googlesitekit-setup-module__action--justify">
					<Button onClick={ this.submitPropertyEventHandler }>{ __( 'Continue', 'google-site-kit' ) }</Button>
					<HelpLink />
				</div>
			</Fragment>
		);
	}

	static connected() {
		return (
			<section className="googlesitekit-setup-module googlesitekit-setup-module--search-console">
				<h2 className="
					googlesitekit-heading-3
					googlesitekit-setup-module__title
				">
					{ __( 'Search Console', 'google-site-kit' ) }
				</h2>
				<p className="googlesitekit-setup-module__text--no-margin">{ __( 'Your Search Console is set up with Site Kit.', 'google-site-kit' ) }</p>
				{ /* TODO This needs a continue button or redirect. */ }
			</section>
		);
	}

	noSiteForm() {
		const { siteURL } = this.state;

		return (
			<Fragment>
				<div className="googlesitekit-setup-module__inputs">
					<TextField
						label={ __( 'Website Address', 'google-site-kit' ) }
						name="siteProperty"
						floatingLabelClassName="mdc-floating-label--float-above"
						outlined
						disabled
					>
						<Input
							value={ siteURL }
						/>
					</TextField>
				</div>
				<div className="googlesitekit-setup-module__action googlesitekit-setup-module__action--justify">
					<Button onClick={ this.submitPropertyEventHandler }>{ __( 'Continue', 'google-site-kit' ) }</Button>
					<HelpLink />
				</div>
			</Fragment>
		);
	}

	renderForm() {
		const { loading, sites } = this.state;

		if ( loading ) {
			return (
				<Fragment>
					<p>{ __( 'We’re locating your Search Console account.', 'google-site-kit' ) }</p>
					<ProgressBar />
				</Fragment>
			);
		}

		if ( 0 === sites.length ) {
			return this.noSiteForm();
		}

		return this.matchedForm();
	}

	render() {
		const {
			isAuthenticated,
			shouldSetup,
		} = this.props;
		const {
			errorMsg,
			connected,
		} = this.state;

		if ( ! shouldSetup || connected ) {
			return SearchConsole.connected();
		}

		return (
			<section className="googlesitekit-setup-module googlesitekit-setup-module--search-console">
				<h2 className="
					googlesitekit-heading-3
					googlesitekit-setup-module__title
				">
					{ __( 'Search Console', 'google-site-kit' ) }
				</h2>

				{
					errorMsg && 0 < errorMsg.length &&
					<p className="googlesitekit-error-text">
						{ errorMsg }
					</p>
				}

				{ isAuthenticated && shouldSetup && this.renderForm() }

			</section>
		);
	}
}

SearchConsole.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	shouldSetup: PropTypes.bool.isRequired,
	searchConsoleSetup: PropTypes.func.isRequired,
	setErrorMessage: PropTypes.func.isRequired,
};

export default SearchConsole;
