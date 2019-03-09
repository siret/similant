import React, {Component} from 'react';
import * as PubSub from 'pubsub-js';
import DescriptorSelectorContainer from "./DescriptorSelectorContainer";
import ClusterSliderContainer from "./ClusterSliderContainer";
import ClusterView from "./ClusterView";

import "./index.scss";
import DescriptorView from "./DescriptorView";

class ClusterBlock extends Component {
	constructor() {
		super();
		this.state = { descriptor: null, cluster: null };
	}

	handleDescriptor(descriptor) {
		if ( descriptor !== null ) {
			this.fetchDescriptor(descriptor);
		} else {
			PubSub.publish("TargetView.hide", "global");
			this.setState({ descriptor: null, cluster: null });
		}
	}

	fetchDescriptor(descriptor) {
		fetch(descriptor.url)
			.then(res => res.json())
			.then(
				descriptorData => {
					this.setState({ descriptor: descriptorData, cluster: null }, () => {
						this.handleCluster(descriptorData.clusters[0]);
						PubSub.publish("DescriptorView.show", {
							id: 'global',
							name: 'Global',
							data: {
								'entries': Object.keys(descriptorData.data)
							}
						});
						PubSub.publish("TargetView.show", {
							name: "DataSet",
							data: Object.keys(descriptorData.data)
						});
					});
				},
				error => {
					this.setState({ descriptor: null, cluster: null });
					PubSub.publish("ERROR", "Cannot load data from " + descriptor.url + ".\n" + error);
				}
			);
	}

	handleCluster(cluster) {
		if ( cluster !== null ) {
			this.fetchCluster(cluster);
		} else {
			this.setState({ cluster: null });
		}
	}

	handleClusterSelected(clusterIdx) {

	}

	fetchCluster(cluster) {
		fetch(cluster.url)
			.then(res => res.json())
			.then(
				clusterData => {
					this.setState({ cluster: clusterData })
				},
				error => {
					this.setState({ cluster: null });
					PubSub.publish("ERROR", "Cannot load data from " + cluster.url + ".\n" + error);
				}
			)
	}

	render() {
		return <section id="ClusterBlock">
			<header>
				<DescriptorSelectorContainer onChange={(d) => this.handleDescriptor(d)} />
				<ClusterSliderContainer
					clusters={this.state.descriptor ? this.state.descriptor.clusters : null}
					onChange={(c) => this.handleCluster(c)} />
			</header>
			<ClusterView onChange={(c) => this.handleClusterSelected(c)} cluster={this.state.cluster} />
			<DescriptorView descriptor={this.state.descriptor} />
		</section>;
	}
}

export default ClusterBlock;