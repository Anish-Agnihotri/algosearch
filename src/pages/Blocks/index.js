import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

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
				<p>Blocks</p>
			</Layout>
		);
	}
}

export default Blocks;
