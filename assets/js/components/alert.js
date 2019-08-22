/**
 * Alert component.
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

import data from 'GoogleComponents/data';
import Notification from 'GoogleComponents/notifications/notification';
import PropTypes from 'prop-types';

import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';

class Alert extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			isLoading: true,
			alerts: [],
			error: false,
			message: '',
		};
	}

	componentDidMount() {
		this.getAlert();
	}

	async getAlert() {
		try {
			const { module } = this.props;

			// Fetching the data, could be from the cache or rest endpoint.
			const responseData = await data.getNotifications( module, 3600 );

			this.setState( {
				isLoading: false,
				error: false,
				alerts: responseData,
			} );
		} catch ( err ) {
			this.setState( {
				isLoading: false,
				error: err.code,
			} );
		}
	}

	render() {
		const { alerts, error, isLoading } = this.state;

		if ( error || isLoading || ! alerts || ! alerts.items || ! alerts.items.length ) {
			return null;
		}

		const {
			items,
			url,
			ctaLabel,
			ctaTarget,
		} = alerts;

		const notifications = items.map( item =>
			<Notification
				id={ item.id }
				key={ item.id }
				title={ item.title }
				description={ item.message || item.description }
				dismiss={ __( 'Dismiss', 'google-site-kit' ) }
				isDismissable={ item.isDismissible }
				format='small'
				ctaLink={ url }
				ctaLabel={ ctaLabel }
				ctaTarget={ ctaTarget }
				type={ item.severity }
			/> );

		return (
			<Fragment>
				{ notifications }
			</Fragment>
		);
	}
}

Alert.propTypes = {
	module: PropTypes.string.isRequired,
};

export default Alert;
