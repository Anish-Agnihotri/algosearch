import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';

class Transactions extends React.Component {
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name="Transactions"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="All Transactions"
				/>
				<div className="cardcontainer">
					<Statscard
						stat="Latest block"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Transactions sent (24H)"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Volume (24H)"
						value="98.201 Billion"
					/>
				</div>
				<p>Transactions</p>
			</Layout>
		);
	}
}

export default Transactions;
