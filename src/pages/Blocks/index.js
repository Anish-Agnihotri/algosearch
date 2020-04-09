import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';

class Blocks extends React.Component {
	render() {
		const dummyData = [{
			'round': '',
			'transactions': '',
			'proposedby': '',
			'time': ''
		}];
		return (
			<Layout>
				<Breadcrumbs
					name="Blocks"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="Blocks"
				/>
				<div className="cardcontainer">
					<Statscard
						stat="Latest block"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Average Block Time (100 blocks)"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Reward Rate"
						value="98.201 Billion"
					/>
				</div>
				<div className="blockTable">
					<div>
					
					</div>
					<div>

					</div>
				</div>
			</Layout>
		);
	}
}

export default Blocks;
