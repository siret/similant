import React, {Component} from 'react';
import IndividualBlock from "./IndividualBlock";
import ClusterBlock from "./ClusterBlock";
import TargetBlock from "./TargetBlock";

import './BasicClusterView.scss';

class BasicClusterView extends Component {
	render() {
		return <main>
			<h1>SimilAnT</h1>
			<IndividualBlock/>
			<ClusterBlock/>
			<TargetBlock/>
		</main>;
	}
}

export default BasicClusterView;