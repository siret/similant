import React, {Component} from 'react';
import * as PubSub from 'pubsub-js';
import IndividualSelector from "./IndividualSelector";

class IndividualSelectorContainer extends Component {
	constructor() {
		super();
		this.state = {idx: 0, individuals: null};
	}

	componentDidMount() {
		PubSub.subscribe("CLUSTER", (key, cluster) => {
			if (cluster === null && this.state.individuals === null) {

			} else if ( cluster === null ) {
				this.setState({idx: 0, individuals: null});
			} else if (cluster.items !== this.state.individuals) {
				this.setState({idx: 0, individuals: [""].concat(cluster.items)});
			}
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe("CLUSTER");
	}

	componentDidUpdate()  {
		const idx = this.state.idx;
		const individual = idx > 0 ? this.state.individuals[idx] : null;

		if (typeof this.props.onChange !== 'undefined') {
			this.props.onChange(individual);
		}

		if (individual) {
			PubSub.publish('DescriptorView.show', {
				id: 'individual',
				name: 'Individual',
				data: {
					'medoid': individual,
					'entries': [ individual ]
				}
			});
		} else {
			PubSub.publish('DescriptorView.hide', 'individual');
		}
	}

	handleChange(idx) {
		this.setState({idx: idx});
	}

	render() {
		if (!this.state.individuals)
			return <div>Choose cluster please...</div>;
		return <IndividualSelector
			individuals={this.state.individuals}
			value={this.state.idx}
			onChange={(idx) => this.handleChange(idx)}
		/>;
	}
}

export default IndividualSelectorContainer;