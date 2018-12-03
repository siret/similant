import React, {Component} from 'react';

class DescriptorSelector extends Component {
	handleChange(event) {
		if (typeof this.props.onChange !== 'undefined') {
			this.props.onChange(Number(event.target.value));
		}
	}

	render() {
		return <select onChange={(e) => this.handleChange(e)} value={this.props.value}>
			{this.props.descriptors.map((descriptor, index) => (
				<option key={descriptor.url} value={index}>
					{descriptor.name}
				</option>
			))}
		</select>;
	}
}

export default DescriptorSelector;
