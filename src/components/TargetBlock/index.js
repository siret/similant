import React, {Component} from 'react';
import * as PubSub from 'pubsub-js';
import TargetSelectorContainer from "./TargetSelectorContainer";
import TargetView from "./TargetView";

import './index.scss';
import TargetTable from "./TargetTable";

class TargetBlock extends Component {
	constructor() {
		super();
		this.state = { target: null };
	}

	handleTarget(target) {
		if ( target !== null ) {
			this.fetchTarget(target);
		} else {
			this.setState({ target: null });
		}
	}

	fetchTarget(target) {
		fetch(target.url)
			.then(res => res.json())
			.then(
				targetData => {
					this.setState({ target: targetData }, () => {
						/*PubSub.publish("TargetView.show", {
							name: 'Global',
							data: Object.keys(targetData.data)
						});*/
					});
				},
				error => {
					this.setState({ target: null });
					PubSub.publish("ERROR", "Cannot load date from " + target.url + ".\n" + error);
				}
			);
	}

	render() {
		return <section id="TargetBlock">
			<TargetSelectorContainer onChange={t => this.handleTarget(t)}/>
			<TargetView target={this.state.target} />
			<TargetTable target={this.state.target} />
		</section>;
	}
}

export default TargetBlock;