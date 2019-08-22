/**
 * DashboardModulesAlerts component.
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

import Notification from 'GoogleComponents/notifications/notification';
import { modulesNotificationsToRequest, getModulesNotifications } from 'GoogleComponents/notifications/util';

import { Component, Fragment } from '@wordpress/element';
import { each } from 'lodash';
import { __ } from '@wordpress/i18n';

class DashboardModulesAlerts extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			data: false,
			cta: false,
		};
	}

	componentDidMount() {
		const modules = modulesNotificationsToRequest();

		if ( modules ) {
			getModulesNotifications( modules ).then( ( response ) => {
				this.setState( {
					data: response.results,
					cta: response.cta,
				} );
			} );
		}
	}

	render() {
		const { data } = this.state;
		const { cta } = this.state;

		if ( 0 === Object.keys( data ).length ) {
			return null;
		}

		const notifications = [];

		Object.keys( data ).map( key => {

			each( data[ key ], notification => {

				notifications.push(
					<Notification
						key={ notification.id }
						id={ notification.id }
						title={ notification.title || '' }
						description={ notification.description || '' }
						blockData={ notification.blockData || [] }
						winImage={ notification.winImage ? `${googlesitekit.admin.assetsRoot}images/${notification.winImage}` : '' }
						format={ notification.format || 'small' }
						learnMoreUrl={ notification.learnMoreUrl || '' }
						learnMoreDescription={ notification.learnMoreDescription || '' }
						learnMoreLabel={ notification.learnMoreLabel || '' }
						ctaLink={ cta.url || '' }
						ctaLabel={ cta.label || '' }
						ctaTarget={ cta.target || '' }
						type={ notification.severity || '' }
						dismiss={ notification.dismiss || __( 'OK, Got it!', 'google-site-kit' ) }
						isDismissable={ notification.isDismissable || true }
						logo={ notification.logo || true }
						module={ key }
						moduleName={ googlesitekit.modules[key].name }
						pageIndex={ notification.pageIndex || '' }
						storageType={ notification.storageType || 'sessionStorage' }
						dismissExpires={ notification.dismissExpires || 0 }
						showOnce={ notification.showOnce || false }
					/>
				);
			} );

		} );
		return (
			<Fragment>
				{ notifications }
			</Fragment>
		);
	}
}

export default DashboardModulesAlerts;
