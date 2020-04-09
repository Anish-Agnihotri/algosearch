import React from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

class Address extends React.Component {
	constructor() {
		super();

		this.state = {
			address: 0,
		}
	}
	componentDidMount() {
		const { address } = this.props.match.params;
		this.setState({address: address});
		document.title=`AlgoSearch | Address ${address}`;
	}
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name={`Address #${this.state.address}`}
					parentLink="/Addresss"
					parentLinkName="Addresss"
					currentLinkName={`Address #${this.state.address}`}
				/>
				<p>Address {this.state.address}</p>
			</Layout>
		);
	}
}

export default Address;
