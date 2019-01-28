import React, {Component} from 'react';

class IndividualTable extends Component {
	render() {
		if (this.props.data === null)
			return <div>Please choose individual...</div>;
		return <div className="overflow-scroll"><table>
			<tbody>
			{Object.entries(this.props.data.data).map((row) => (
				<tr key={row[0]}>
					<th>{row[0]}</th>
					<td>{row[1]}</td>
				</tr>
			))}
			</tbody>
		</table></div>;
	}
}

export default IndividualTable;
