import React from 'react';
import axios from 'axios';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import {NavLink} from 'react-router-dom';
import ReactTable from 'react-table-6';
import AlgoIcon from '../../components/algoicon';
import 'react-table-6/react-table.css';
import {formatValue, siteName} from '../../constants';

class AddressTransaction extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			data: []
		};
	}

	getAllTransactions = address => {
		axios({
			method: 'get',
			url: `${siteName}/all/addresstx/${address}`
		}).then(response => {
			this.setState({data: response.data, loading: false});
		})
	}

	componentDidMount() {
		const { address } = this.props.match.params;
		this.setState({address: address});
		document.title=`AlgoSearch | Transactions for ${address}`;
		this.getAllTransactions(address);
	}

	render() {
		// Table columns
		const columns = [
			{Header: '#', accessor: 'round', Cell: props => <span className="rownumber">{props.index + 1}</span>},
			{Header: 'Round', accessor: 'round', Cell: props => <NavLink to={`/block/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'TX ID', accessor: 'tx', Cell: props => <NavLink to={`/tx/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'From', accessor: 'from', Cell: props => this.state.address === props.value ? <span className="nocolor">{props.value}</span> : <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>}, 
			{Header: '', accessor: 'from', Cell: props => this.state.address === props.value ? <span className="type noselect">OUT</span> : <span className="type type-width-in noselect">IN</span>},
			{Header: 'To', accessor: 'payment.to', Cell: props => this.state.address === props.value ? <span className="nocolor">{props.value}</span> : <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>},
			{Header: 'Amount', accessor: 'payment.amount', Cell: props => <span>{formatValue(props.value / 1000000)} <AlgoIcon /></span>},
			{Header: 'Time', accessor: 'round', Cell: props=> <span className="nocolor">Coming soon</span>}
		];

		return (
			<Layout>
				<Breadcrumbs
					name={`Transactions List`}
					address={this.state.address}
					parentLink={`/address/${this.state.address}`}
					parentLinkName="Address Details"
					currentLinkName={`Transactions List`}
				/>
				<div className="block-table addresses-table">
					<span>{this.state.data.length && this.state.data.length > 0 ? `Showing all ${this.state.data.length} transaction` : `Loading transactions...`}</span>
					<div>
						<ReactTable
							data={this.state.data}
							columns={columns}
							loading={this.state.loading}
							defaultPageSize={25}
							pageSizeOptions={[25, 50, 100]}
							sortable={false}
							className="transactions-table addresses-table-sizing"
						/>
					</div>
				</div>
			</Layout>
		);
	}
}

export default AddressTransaction;
