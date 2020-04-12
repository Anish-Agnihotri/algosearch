import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

class Dev extends React.Component {
	componentDidMount() {
		document.title="AlgoSearch | Developer APIs";
	}
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name="Developer APIs"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="Developer APIs"
				/>
				<center><h1>Coming Soon</h1></center>
			</Layout>
		);
	}
}

export default Dev;
