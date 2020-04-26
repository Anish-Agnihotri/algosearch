import React from 'react';
import axios from 'axios';
import './index.css';
import Layout from '../../components/layout';
import { NavLink } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';
import AlgoIcon from '../../components/algoicon';
import 'react-table-6/react-table.css';
import {formatValue, siteName} from '../../constants';
import Load from '../../components/tableloading';

class Transactions extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true, // Default loading = true
			pageSize: 25, // Default pageSize = 25
			pages: -1, // By default, pages to -1,
			max_transactions: 0, // Set maximum transaction number to 0
			transactions: [] // Transactions data
		};
	}
	
	// Update page size
	updatePageSize = (pageIndex, pageSize) => {
		this.setState({
			pageSize: pageSize, // Set pageSize to new page size
			pages: Math.ceil(this.state.max_transactions / pageSize) // Set pages to new number of pages
		}, () => {
			this.updateTransactions(pageIndex); // Run update to get new data based on update page size and current index
		});
	};

	// Update transactions based on page number
	updateTransactions = pageIndex => {
		// Let the request headtransaction be max_transactions - (current page * pageSize)
		let headTransaction = pageIndex * this.state.pageSize;

		axios({
			method: 'get',
			url: `${siteName}/all/transactions/${headTransaction + this.state.pageSize}/${this.state.pageSize}/0` // Use pageSize from state
		}).then(response => {
			this.setState({transactions: response.data.transactions}); // Set transactions to new data to render
		}).catch(error => {
			console.log("Exception when updating transactions: " + error);
		})
	};

	getTransactions = () => {
		axios({
			method: 'get',
			url: `${siteName}/all/transactions/25/25/0`,
		}).then(response => {
			this.setState({
				transactions: response.data.transactions, // Set transactions data
				max_transactions: response.data.total_transactions,
				pages: Math.ceil(response.data.total_transactions / 25), // Set pages to rounded up division
				loading: false // Set loading to false
			});
		}).catch(error => {
			console.log("Exception when retrieving last 25 transactions: " + error);
		})
	}

	componentDidMount() {
		document.title="AlgoSearch | Transactions";
		this.getTransactions();
	}

	render() {
		// Table columns
		const columns = [
			{Header: 'Round', accessor: 'round', Cell: props => <NavLink to={`/block/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'TX ID', accessor: 'tx', Cell: props => <NavLink to={`/tx/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'Type', accessor: 'type', Cell: props => <span className="type noselect">{props.value}</span>},
			{Header: 'From', accessor: 'from', Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'To', accessor: 'to', Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>},
			{Header: 'Amount', accessor: 'amount', Cell: props => <span>{formatValue(props.value)} <AlgoIcon /></span>},
			{Header: 'Fee', accessor: 'fee', Cell: props => <span>{formatValue(props.value)} <AlgoIcon /></span>}
		];

		return (
			<Layout>
				<Breadcrumbs
					name="Transactions"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="All Transactions"
				/>
				<div className="cardcontainer">
					<Statscard
						stat="Transaction last seen"
						value={this.state.loading ? <Load /> : formatValue(this.state.transactions[0].round)}
					/>
					<Statscard
						stat="Transactions sent (24H)"
						value=""
					/>
					<Statscard
						stat="Volume (24H)"
						value=""
					/>
				</div>
				<div className="table">
					<div>
						<p>{this.state.loading ? "Loading" : formatValue(this.state.max_transactions)} transactions found</p>
						<p>(Showing the last {this.state.transactions.length} records)</p>
					</div>
					<div>
						<ReactTable
							pageIndex={0}
							pages={this.state.pages}
							data={this.state.transactions}
							columns={columns}
							loading={this.state.loading}
							defaultPageSize={25}
							pageSizeOptions={[25, 50, 100]}
							onPageChange={pageIndex => this.updateTransactions(pageIndex)}
							onPageSizeChange={(pageSize, pageIndex) => this.updatePageSize(pageIndex, pageSize)}
							sortable={false}
							className="transactions-table"
							manual
						/>
						</div>
					</div>
			</Layout>
		);
	}
}

export default Transactions;
