/**
 * Optin component.
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

import Checkbox from 'GoogleComponents/checkbox';
import PropTypes from 'prop-types';

import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class Optin extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			optIn: googlesitekit.admin.trackingOptin || false,
			error: false,
		};

		this.handleOptIn = this.handleOptIn.bind( this );
	}

	handleOptIn( e ) {

		const checked = e.target.checked;

		const body      = {
			'googlesitekit_tracking_optin': checked,
		};

		wp.apiFetch( { path: '/wp/v2/settings',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify( body ),
			method: 'POST',
		} )
			.then( () => {
				this.setState( {
					optIn: !! checked,
					error: false,
				} );
			} )
			.catch( ( err ) => {
				this.setState( {
					optIn: ! e.target.checked,
					error: {
						errorCode: err.code,
						errorMsg: err.message,
					},
				} );
			} );
	}

	render() {
		const {
			optIn,
			error,
		} = this.state;

		const {
			id,
			name,
		} = this.props;

		return (
			<div className="googlesitekit-opt-in">
				<Checkbox
					id={ id }
					name={ name }
					value="1"
					checked={ optIn }
					onChange={ this.handleOptIn }
				>
					{ __( 'Help us improve the Site Kit plugin by allowing tracking of anonymous usage stats. All data are treated in accordance with ', 'google-site-kit' ) }
					<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{ __( 'Google Privacy Policy', 'google-site-kit' ) }</a>.
				</Checkbox>
				{ error &&
				<div className="googlesitekit-error-text">
					{ error.errorMsg }
				</div>
				}
			</div>
		);
	}
}

Optin.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
};

Optin.defaultProps = {
	id: 'opt-in',
	name: 'optIn',
};

export default Optin;
