import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import * as PubSub from 'pubsub-js';

class ClusterView extends Component {
	constructor(props) {
		super(props);
		this.state = {cluster: props.cluster, selected: null}
	}

	componentDidUpdate() {
		if (this.state.selected) {
			PubSub.publish("CLUSTER", this.state.cluster[this.state.selected]);
			PubSub.publish("DescriptorView.show", {
				id: 'cluster',
				name: 'Cluster',
				data: {
					'medoid': this.state.selected,
					'entries': this.state.cluster[this.state.selected].items
				}
			});
			PubSub.publish("TargetView.show", {
				name: "Cluster",
				data: this.state.cluster[this.state.selected].items
			});
		} else {
			PubSub.publish("CLUSTER", null);
			PubSub.publish("DescriptorView.hide", 'cluster');
			PubSub.publish("TargetView.hide", "Cluster");
		}
	}

	componentWillReceiveProps(props) {
		if (this.state.cluster !== props.cluster) {
			this.setState({cluster: props.cluster, selected: null});
		}
	}

	getOptions() {
		return {
			xAxis: {
				show: false,
				scale: true
			},
			yAxis: {
				show: false,
				scale: true
			},
			animation: false,
			series: [{
				type: 'scatter',
				data: Object.values(this.state.cluster).map((c) => {
					let colorValue = Math.min(16 * Math.log(c.radius), 127);
					return {
						name: c.id,
						value: c.pos,
						symbol: 'circle',
						symbolSize: 5 * Math.max(Math.log(c.items.length), 1),
						itemStyle: {
							color: 'rgb(' + colorValue + ',' + colorValue + ',' + colorValue + ')',
							borderColor: 'black',
							borderWidth: c.id === this.state.selected ? 5 : 0,
						}
					};
				})
			}]
		}
	}

	handleClick(event) {
		this.setState((state) => {
			return {selected: state.selected !== event.name ? event.name : null};
		});
	}

	render() {
		const events = {
			'click': e => this.handleClick(e),
		};

		if (this.state.cluster === null)
			return <div className="ClusterView">Please choose cluster...</div>;
		return <ReactEcharts className="ClusterView" style={{width: '100%', height: '100%'}} option={this.getOptions()} onEvents={events}/>;
	}
}

export default ClusterView;