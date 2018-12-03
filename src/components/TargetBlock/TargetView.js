import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import * as PubSub from 'pubsub-js';

class TargetView extends Component {
	constructor(props) {
		super(props);
		this.state = {target: props.target, series: new Map()};
	}

	componentDidMount() {
		PubSub.subscribe("TargetView.show", (event, series) => {
			this.setState(state => {
				state.series.set(series.name, series);
				return { series: state.series };
			});
		});
		PubSub.subscribe("TargetView.hide", (event, seriesKey) => {
			this.setState(state => {
				state.series.delete(seriesKey);
				return { series: state.series };
			})
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe("TargetView.show");
		PubSub.unsubscribe("TargetView.hide");
	}

	componentWillReceiveProps(props) {
		if (this.state.target === null && props.target === null) {
			// empty condition
		} else if (this.state.target === null || props.target === null) {
			this.setState({ target: props.target });
		} else if ( this.state.target.name !== props.target.name ) {
			this.setState({ target: props.target });
		}
	}

	getOptions() {
		let _target = this.state.target;
		let _series = this.state.series;

		switch (_target.type) {
			case 'ordinal':
				return {
					legend: {
						data: Array.from(_series.keys()),
						align: 'left'
					},
					xAxis: {
						data: _target.axis
					},
					yAxis: {},
					animation: false,
					series: Array.from(_series.values()).map(series => {
						return {
							name: series.name,
							type: 'bar',
							data: _target.axis.map(key => {
								const ret = series.data.filter(k => _target.data[k] === key).length;
								return ret !== 0 ? Math.log(ret) : 0;
							})
						};
					})
				};

			case 'histogram':
				return {
					legend: {
						data: Array.from(_series.keys()),
						align: 'left'
					},
					xAxis: {
						data: _target.bins,
					},
					yAxis: {},
					animation: false,
					series: Array.from(_series.values()).map(series => {
						let lastValue = 0;
						return {
							name: series.name,
							type: 'bar',
							data: _target.bins.map(key => {
								let ret = series.data.filter(k => lastValue < _target.data[k] && _target.data[k] <= key).length;
								lastValue = key;
								return ret !== 0 ? Math.log(ret) : 0;
							})
						};
					})
				};

			default:
				return {};
		}
	}

	render() {
		if (this.state.target === null)
			return <div className="TargetView">Please choose target...</div>;
		return <ReactEcharts className="TargetView" option={this.getOptions()} notMerge={true} lazyUpdate={false} />
	}
}

export default TargetView;