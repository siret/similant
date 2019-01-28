import React, {Component} from 'react';
import DescriptorSelector from "./DescriptorSelector";
import * as PubSub from "pubsub-js";

class DescriptorSelectorContainer extends Component {
	constructor() {
		super();
		this.state = {idx: 0, descriptors: []};
	}

	componentDidMount() {
		this.fetchDescriptors();
	}

	fetchDescriptors() {
		fetch('data/descriptors.json')
			.then(res => res.json())
			.then(
				descriptors => this.setState({descriptors: [{name: "", url: null}].concat(descriptors)}),
				error => PubSub.publish("ERROR", "Cannot load data from /data/descriptors.json.\n" + error)
			);
	}

	handleChange(idx) {
		this.setState({idx: idx}, () => {
			const descriptor = idx > 0 ? this.state.descriptors[idx] : null;

			if (typeof this.props.onChange !== 'undefined') {
				this.props.onChange(descriptor);
			}
		});
	}

	render() {
		return <DescriptorSelector
			descriptors={this.state.descriptors}
			value={this.state.idx}
			onChange={(idx) => this.handleChange(idx)}
		/>;
	}
}

export default DescriptorSelectorContainer;
