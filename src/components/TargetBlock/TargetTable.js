import React, {Component} from 'react';
import * as PubSub from 'pubsub-js';
import * as jStat from 'jStat';

class TargetTable extends Component {
	constructor() {
		super();
		this.state = { cluster: null };
	}

	componentDidMount() {
		PubSub.subscribe("CLUSTER", (key, cluster) => {
			this.setState( { cluster: cluster } );
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe("CLUSTER");
	}

	static entropy(data) {
		let counter = data.reduce((acc, cur) => {
			if ( typeof acc[ cur ] === 'undefined' )
				acc[ cur ] = 0.0;
			acc[ cur ] += 1.0;
			return acc;
		}, {});
		let percentage = Object.values(counter).map(cnt => {
			return cnt / data.length;
		});
		let entropy = percentage.reduce(function (acc, cur) {
			return acc + cur * Math.log2(cur);
		}, 0);
		return -entropy;
	}

	statistics() {
		let globalData = Object.values(this.props.target.data);
		let clusterData = Object.values(this.state.cluster.items.map(
			key => this.props.target.data[key]
		));

		//let globalData = this.props.target.data;

		if (this.props.target.type === "ordinal") {
			let convert = new Map();
			this.props.target.axis.forEach((value, key) => {
				convert.set(value, key);
			});

			globalData = globalData.map(value => convert.get(value));
			clusterData = clusterData.map(value => convert.get(value));
		}

		const globalStat = jStat(globalData);
		const clusterStat = jStat(clusterData);

		return {
			"Count": {
				global: globalStat.cols(),
				cluster: clusterStat.cols()
			},
			"Mean": {
				global: globalStat.mean(),
				cluster: clusterStat.mean()
			},
			"Variance": {
				global: globalStat.variance(),
				cluster: clusterStat.variance()
			},
			"Entropy": {
				global: TargetTable.entropy(globalData),
				cluster: TargetTable.entropy(clusterData)
			},
			"Information Gain": {
				global: 0,
				cluster: TargetTable.entropy(globalData) - TargetTable.entropy(clusterData)
			}
		};
	}

	render() {
		if (this.props.target === null || this.state.cluster === null)
			return <div>Please choose target and cluster.</div>;
		return <table>
			<thead>
			<tr>
				<th>&nbsp;</th>
				<th>Global</th>
				<th>Cluster</th>
			</tr>
			</thead>
			<tbody>
			{Object.entries(this.statistics()).map(row => (
				<tr key={row[0]}>
					<th>{row[0]}</th>
					<td>{Math.round(row[1].global * 10e3) / 10e3}</td>
					<td>{Math.round(row[1].cluster * 10e3) / 10e3}</td>
				</tr>
			))}
			</tbody>
		</table>;
	}
}

export default TargetTable;