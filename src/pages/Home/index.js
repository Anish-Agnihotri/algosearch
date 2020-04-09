import React from 'react';
import Layout from '../../components/layout';

class Home extends React.Component {
	componentDidMount() {
		document.title="AlgoSearch | Home";
	}
	render() {
		return (
			<Layout>
				<p>Home</p>
			</Layout>
		);
	}
}

export default Home;
