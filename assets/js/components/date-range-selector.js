/**
 * External dependencies
 */
import { Select } from 'SiteKitCore/material-components';
import PropTypes from 'prop-types';

const { _n, sprintf } = wp.i18n;
const { Component } = wp.element;

export const lastDaysOption = ( value ) => {
	return {
		// eslint-disable-next-line @wordpress/valid-sprintf
		label: sprintf(
			_n( 'Last 24 hours', 'Last %d days', value, 'google-site-kit' ),
			value
		),
		value,
	};
};

class DateRangeSelector extends Component {
	constructor( props ) {
		super( props );

		this.handleSelection = this.handleSelection.bind( this );
	}

	handleSelection( index, item ) {
		console.log( { index, item } ); // eslint-disable-line
		// // Trigger a data refresh.
		// doAction( 'googlesitekit.moduleDataReset' );
		// doAction( 'googlesitekit.moduleLoaded', context );
		// return false;
		this.props.onChange( { value: item.dataset.value } );
	}

	render() {
		return (
			<Select
				enhanced
				className="mdc-select--minimal"
				name="time_period"
				label=""
				onEnhancedChange={ this.handleSelection }
				options={ this.props.options }
				value={ this.props.value }
			/>
		);
	}
}

DateRangeSelector.defaultProps = {
	value: '28',
	options: [
		lastDaysOption( '7' ),
		lastDaysOption( '14' ),
		lastDaysOption( '28' ),
		lastDaysOption( '90' ),
	],
};

DateRangeSelector.propTypes = {
	onChange: PropTypes.func.isRequired,
};

export default DateRangeSelector;
