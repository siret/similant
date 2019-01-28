import React, {Component} from 'react';
import TargetSelector from "./TargetSelector";
import * as PubSub from "pubsub-js";

class TargetSelectorContainer extends Component {
	constructor() {
		super();
		this.state = {idx: 0, targets: []};
	}

	componentDidMount() {
		this.fetchTargets();
	}

	fetchTargets() {
		fetch('data/targets.json')
			.then(res => res.json())
			.then(
				targets => this.setState({targets: [{name: "", url: null}].concat(targets)}),
				error => PubSub.publish("ERROR", "Cannot load data from /data/targets.json.\n" + error)
			);
	}

	handleChange(idx) {
		this.setState({idx: idx}, () => {
			const target = idx > 0 ? this.state.targets[idx] : null;

			if (typeof this.props.onChange !== 'undefined') {
				this.props.onChange(target);
			}
		});
	}

	render() {
		return <TargetSelector
			targets={this.state.targets}
			value={this.state.idx}
			onChange={idx => this.handleChange(idx)}
		/>
	}
}

export default TargetSelectorContainer;