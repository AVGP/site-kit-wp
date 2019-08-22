/**
 * Publisher wins initialization.
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

import { getTimeInSeconds, getQueryParameter } from 'GoogleUtil';
import * as publisherWinCallbacks from 'GoogleComponents/publisher-wins/callbacks';

import { addFilter } from '@wordpress/hooks';
const notification = getQueryParameter( 'notification' );

if ( 'authentication_success' !== notification && 'authentication_failure' !== notification ) {

	addFilter( 'googlesitekit.winCallbacks',
		'googlesitekit.publisherwinCallbacks',
		( callbacks ) => {
			return { ...callbacks, ...publisherWinCallbacks };
		} );

	/**
	* Add components to the Site Kit Dashboard Win Notifications.
	*/
	addFilter( 'googlesitekit.WinsNotificationsRequest',
		'googlesitekit.PublisherWinsNotification',
		( wins ) => {
			const data =  {
				identifier: 'first-post-win',
				storageType: 'localStorage',
			};
			wins.push( data );
			return wins;
		}, 1 );

	addFilter( 'googlesitekit.WinsNotificationsRequest',
		'googlesitekit.PublisherWinsNotification',
		( wins ) => {
			const data =  {
				identifier: 'publishing-win',
				storageType: 'localStorage',
				withData: {
					dataObject: 'modules',
					identifier: 'search-console',
					datapoint: 'sc-site-analytics',
					priority: 1,
					maxAge: getTimeInSeconds( 'day' ),
					context: 'Dashboard',
				}
			};
			wins.push( data );
			return wins;
		}, 1 );

	addFilter( 'googlesitekit.WinsNotificationsRequest',
		'googlesitekit.PublisherWinsNotification',
		( wins ) => {
			const data =  {
				identifier: 'total-stats',
				storageType: 'localStorage',
				withData: {
					dataObject: 'modules',
					identifier: 'search-console',
					datapoint: 'sc-site-analytics',
					priority: 1,
					maxAge: getTimeInSeconds( 'day' ),
					context: 'Dashboard',
				}
			};
			wins.push( data );
			return wins;
		}, 2 );

	if ( googlesitekit.modules.analytics.active ) {
		addFilter( 'googlesitekit.WinsNotificationsRequest',
			'googlesitekit.PublisherWinsNotification',
			( wins ) => {
				const data =  {
					identifier: 'pageview-increase',
					storageType: 'localStorage',
					withData: {
						dataObject: 'modules',
						identifier: 'analytics',
						datapoint: 'overview',
						priority: 1,
						maxAge: getTimeInSeconds( 'day' ),
						context: 'Dashboard',
					}
				};
				wins.push( data );
				return wins;
			}, 2 );

		addFilter( 'googlesitekit.WinsNotificationsRequest',
			'googlesitekit.PublisherWinsNotification',
			( wins ) => {
				const data =  {
					identifier: 'traffic-increase',
					storageType: 'localStorage',
					withData: {
						dataObject: 'modules',
						identifier: 'analytics',
						datapoint: 'overview',
						priority: 1,
						maxAge: getTimeInSeconds( 'day' ),
						context: 'Dashboard',
					}
				};
				wins.push( data );
				return wins;
			}, 2 );
	}
}

