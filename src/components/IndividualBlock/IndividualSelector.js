import React, {Component} from 'react';

class IndividualSelector extends Component {
	handleChange(event) {
		if (typeof this.props.onChange !== 'undefined') {
			this.props.onChange(Number(event.target.value));
		}
	}

	render() {
		return <select
			onChange={(e) => this.handleChange(e)}
			size={10}
			value={this.props.value}>
			{this.props.individuals.map((individual, index) => (
				<option key={individual} value={index}>
					{individual}
				</option>
			))}
		</select>
	}
}

export default IndividualSelector;