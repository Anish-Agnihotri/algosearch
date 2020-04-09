import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';

class Blocks extends React.Component {
	render() {
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
				<p>Blocks</p>
			</Layout>
		);
	}
}

export default Blocks;
