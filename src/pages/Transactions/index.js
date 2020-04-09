import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

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
				<p>Transactions</p>
			</Layout>
		);
	}
}

export default Transactions;
