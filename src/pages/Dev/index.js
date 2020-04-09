import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

class Dev extends React.Component {
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name="Developer APIs"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="Developer APIs"
				/>
				<p>Developer APIs</p>
			</Layout>
		);
	}
}

export default Dev;
