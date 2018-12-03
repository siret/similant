import React, {Component} from 'react';

class TargetSelector extends Component {
	handleChange(event) {
		if (typeof this.props.onChange !== 'undefined') {
			this.props.onChange(Number(event.target.value));
		}
	}

	render() {
		return <select onChange={e => this.handleChange(e)} value={this.props.value}>
			{this.props.targets.map((target, index) => (
				<option key={target.url} value={index}>
					{target.name}
				</option>
			))}
		</select>;
	}
}

export default TargetSelector;