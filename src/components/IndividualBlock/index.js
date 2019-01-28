import React, {Component} from 'react';
import * as PubSub from 'pubsub-js';
import IndividualSelectorContainer from "./IndividualSelectorContainer";
import IndividualTable from "./IndividualTable";

import './index.scss';

class IndividualBlock extends Component {
	constructor() {
		super();
		this.state = {individual: null};
		this.individuals = null;
	}

	handleIndividual(individual) {
		if (individual === null && this.state.individual === null) {
			// Do nothing!
		} else if (individual === null) {
			this.setState({individual: null});
		} else if (this.state.individual === null || individual !== this.state.individual.id) {
			this.fetchIndividual(individual);
		}
	}

	fetchIndividual(individual) {
		if (this.individuals === null) {
			fetch("data/individuals.json#" + individual)
				.then(res => res.json())
				.then(
					individualData => {
						this.individuals = individualData;
						if (individualData.hasOwnProperty(individual)) {
							this.setState({individual: individualData[individual]})
						} else {
							PubSub.publish("ERROR", "Cannot be found in /data/individuals.json#" + individual + ".\n");
							if (this.state.individual !== null) {
								this.setState({individual: null});
							}
						}
					},
					error => {
						if (this.state.individual !== null) {
							this.setState({individual: null});
						}
						PubSub.publish("ERROR", "Cannot load data from /data/individuals.json#" + individual + ".\n" + error)
					}
				);
		} else {
			if (this.individuals.hasOwnProperty(individual)) {
				this.setState({individual: this.individuals[individual]})
			} else {
				PubSub.publish("ERROR", "Cannot be found in /data/individuals.json#" + individual + ".\n");
				if (this.state.individual !== null) {
					this.setState({individual: null});
				}
			}
		}
	}

	render() {
		return <section id="IndividualBlock">
			<header>
				<IndividualSelectorContainer onChange={(i) => this.handleIndividual(i)}/>
			</header>
			<IndividualTable data={this.state.individual} />
			{/* Individual Graph Connections */}
		</section>;
	}
}

export default IndividualBlock;