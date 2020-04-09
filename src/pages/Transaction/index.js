import React from 'react';
import './index.css';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

class Transaction extends React.Component {
	constructor() {
		super();

		this.state = {
			txid: 0,
		}
	}
	componentDidMount() {
		const { txid } = this.props.match.params;
		this.setState({txid: txid});
		document.title=`AlgoSearch | Transaction ${txid}`;
	}
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name={`Transaction #${this.state.txid}`}
					parentLink="/transactions"
					parentLinkName="Transactions"
					currentLinkName={`Transaction #${this.state.txid}`}
				/>
				<p>Transaction {this.state.txid}</p>
			</Layout>
		);
	}
}

export default Transaction;
