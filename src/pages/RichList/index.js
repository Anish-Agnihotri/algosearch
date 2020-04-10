import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';

class RichList extends React.Component {
	componentDidMount() {
		document.title="AlgoSearch | Rich List";
	}
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name="Rich List"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="Rich List"
				/>
				{/*
				<div className="cardcontainer">
					<Statscard
						stat="Total Top 100 Algo Value"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Total Algo Supply"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Total Unique Addresses"
						value="98.201 Billion"
					/>
				</div>*/}
				<p>Coming Soon</p>
			</Layout>
		);
	}
}

export default RichList;
