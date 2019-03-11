import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import * as PubSub from 'pubsub-js';
import SetTokens from './DescriptorViews/SetTokens';

class DescriptorView extends Component {
	constructor(props) {
		super(props);
		this.state = {descriptor: props.descriptor, series: new Map()};
	}

	componentDidMount() {
		PubSub.subscribe("DescriptorView.show", (event, series) => {
			this.setState(state => {
			  state.series.set(series.id, series);
			  return { series: state.series };
			});
		});
		PubSub.subscribe("DescriptorView.hide", (event, seriesKey) => {
			this.setState(state => {
				state.series.delete(seriesKey);
				return { series: state.series };
			})
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe("DescriptorView.show");
		PubSub.unsubscribe("DescriptorView.hide");
	}

	componentWillReceiveProps(props) {
		if (this.state.descriptor === null && props.descriptor === null) {
			// empty condition
		} else if (this.state.descriptor === null || props.descriptor === null) {
			this.setState({descriptor: props.descriptor, series: new Map()});
		} else if (this.state.descriptor.id !== props.descriptor.id) {
			this.setState({descriptor: props.descriptor, series: new Map()});
		}
	}

	getOptions() {
		let _descriptor = this.state.descriptor;
		let _series = this.state.series;

		switch (_descriptor.type) {
			case 'time-series':
				return {
					legend: {
						data: Array.from(_series.keys()),
						align: 'left'
					},
					xAxis: {
						data: _descriptor.axis
					},
					yAxis: {},
					animation: false,
					series: Array.from(_series.values()).map((series) => {
						return {
							name: series.name,
							type: 'bar',
							data: series.data.entries.map(function (key) {
								return _descriptor.data[key];
							}).reduce(function (value, accumulator) {
								return accumulator.map(function (num, idx) {
									return Number.parseFloat(num) + Number.parseFloat(value[idx]);
								});
							}).map(function (num) {
								return num / series.data.entries.length;
							})
						}
					})
				};
			default:
				return {};
		}
	}

	render() {
		console.log("DescriptorView", this.state);
		if (this.state.descriptor === null)
			return <div className="DescriptorView">Please choose descriptor...</div>;
		switch (this.state.descriptor.type) {
			case 'time-series':
				return <ReactEcharts className="DescriptorView" style={{width: '100%', height: '100%'}} option={this.getOptions()} notMerge={true} lazyUpdate={false} />;
			case 'set-tokens':
				return <SetTokens descriptor={this.state.descriptor} datasets={Array.from(this.state.series.values())} />;
			default:
				return <div>Unknown descriptor: {this.state.descriptor.type}</div>;
		}

	}
}

export default DescriptorView;
