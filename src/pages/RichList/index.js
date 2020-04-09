import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';

class RichList extends React.Component {
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name="Rich List"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="Rich List"
				/>
				<div className="cardcontainer">
					<Statscard
						stat="Total Top 100 Algo Value"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Total Top 100 Algo Value"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Total Top 100 Algo Value"
						value="98.201 Billion"
					/>
				</div>
			</Layout>
		);
	}
}

export default RichList;
