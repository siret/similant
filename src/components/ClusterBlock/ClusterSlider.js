import React, {Component} from 'react';

class ClusterSlider extends Component {
	constructor(props) {
		super(props);
		this.state = {idx: 0};
	}

	componentWillReceiveProps(props) {
		if ( this.props.value !== props.value )
			this.setState({idx: props.value});
	}

	handleChange(event) {
		this.setState({idx: Number(event.target.value)});
	}

	handleFinalChange(event) {
		this.setState({idx: Number(event.target.value)}, () => {
			if (this.props.onChange !== 'undefined') {
				this.props.onChange(this.state.idx);
			}
		});
	}

	render() {
		return <div>
			<input type="range"
			       min={0} max={this.props.clusters.length - 1}
			       value={this.state.idx} onChange={(e) => this.handleChange(e)}
			       onMouseUp={(e) => this.handleFinalChange(e)}
			       onKeyUp={(e) => this.handleFinalChange(e)}
			/>
			<span>{this.props.clusters[this.state.idx].size}</span>
		</div>;
	}
}

export default ClusterSlider;