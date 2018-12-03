import React, {Component} from 'react';
import ClusterSlider from "./ClusterSlider";

class ClusterSliderContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {idx: 0, clusters: props.clusters};
	}

	componentWillReceiveProps(props) {
		if ( this.state.clusters !== props.clusters ) {
			this.setState({idx: 0, clusters: props.clusters});
		}
	}

	handleChange(idx) {
		if ( this.state.idx !== idx ) {
			this.setState({idx: idx}, () => {
				const cluster = this.state.clusters[idx];
				if (typeof this.props.onChange !== 'undefined') {
					this.props.onChange(cluster);
				}
			});
		}
	}

	render () {
		if (this.state.clusters === null)
			return <span className="help">Please choose descriptor...</span>;
		return <ClusterSlider
			clusters={this.state.clusters}
			value={this.state.idx}
			onChange={(idx) => this.handleChange(idx)}
		/>;
	}
}

export default ClusterSliderContainer;