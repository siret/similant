import React, {Component} from 'react';
import {TagCloud} from "react-tagcloud";
import randomColor from 'randomcolor';
import objectAssign from 'object-assign';

import "./SetTokens.scss";

const TagRenderer = (tag, size) => {
	const fontSize = size + 'px';
	const key = tag.key || tag.value;
	const color = randomColor({seed: tag.value});
	const style = objectAssign({}, styles, {color, fontSize});
	return <span className="tag-cloud-tag" key={key} style={style}>{tag.value}</span>
};

const styles = {
	margin: '0px 3px',
	verticalAlign: 'middle',
	display: 'inline-block'
};

class SetTokens extends Component {

	render() {
		const descriptor_ = this.props.descriptor;
		const labels_ = descriptor_.hasOwnProperty('labels') ? descriptor_.labels : {};
		const limit_ = descriptor_.hasOwnProperty('limit') ? descriptor_.limit : 25;
		return <div className="descriptor-view set-tokens">
			{this.props.datasets.map((dataset, index) => {
				return <div className={"descriptor " + dataset.id} key={index}>
					<strong>{dataset.name}</strong>
					<TagCloud
						minSize={12}
						maxSize={36}
						shuffle={false}
						renderer={TagRenderer}
						tags={Object.entries(dataset.data.entries.reduce((accumulator, value) => {
							descriptor_.data[value].forEach(val => {
								if (!accumulator.hasOwnProperty(val))
									accumulator[val] = 0;
								accumulator[val] += 1;
							});
							return accumulator;
						}, {})).sort((a, b) => b[1] - a[1]).slice(0, limit_).map((val) => {
							return {
								key: val[0],
								value: labels_.hasOwnProperty(val[0]) ? labels_[val[0]] : val[0],
								count: val[1]
							}
						})}/>
				</div>;
			})}
		</div>;
	}
}

export default SetTokens;