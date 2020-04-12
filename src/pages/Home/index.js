import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {NavLink} from 'react-router-dom';
import './index.css';
import Layout from '../../components/layout';
import {formatValue, siteName} from '../../constants';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AlgoIcon from '../../components/algoicon';

class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			blocks: [],
			transactions: [],
			loading: true
		}
	}
	getLatest = () => {
		axios({
			method: 'get',
			url: `${siteName}/latest`
		}).then(response => {
			this.setState({blocks: response.data.blocks, transactions: response.data.transactions, loading: false});
			console.log(response.data);
		})
	};

	componentDidMount() {
		document.title="AlgoSearch | Home";
		this.getLatest();
	}

	render() {
		const block_columns = [
			{Header: 'Round', accessor: 'round', Cell: props => <NavLink to={`/block/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'Proposer', accessor: 'proposer',  Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>},
			{Header: '# TX', accessor: 'numtxn', Cell: props => <span className="nocolor">{props.value}</span>}, 
			{Header: 'Time', accessor: 'timestamp', Cell: props => <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
		];
		const block_columns_id = {id: "home-latest-block-sizing"};

		const transaction_columns = [
			{Header: 'TX ID', accessor: 'tx', Cell: props => <NavLink to={`/tx/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'From', accessor: 'from',  Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>},
			{Header: 'To', accessor: 'payment.to',  Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'Amount', accessor: 'payment.amount', Cell: props => <span>{formatValue(props.value / 1000000)} <AlgoIcon /></span>},
			{Header: 'Time', accessor: 'timestamp', Cell: props => <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
		];
		const transaction_columns_id = {id: "home-latest-transaction-sizing"};

		return (
			<Layout homepage>
				<div className="home-split">
					<div>
						<div className="block-table addresses-table">
							<span>Latest blocks <NavLink to="/blocks" className="viewmore">View more</NavLink></span>
							<div>
								<ReactTable
									data={this.state.blocks}
									columns={block_columns}
									loading={this.state.loading}
									defaultPageSize={10}
									showPagination={false}
									sortable={false}
									className="transactions-table"
									getProps={() => block_columns_id}
								/>
							</div>
						</div>
					</div>
					<div>
						<div className="block-table addresses-table">
							<span>Latest transactions <NavLink to="/transactions" className="viewmore">View more</NavLink></span>
							<div>
								<ReactTable
									data={this.state.transactions}
									columns={transaction_columns}
									loading={this.state.loading}
									defaultPageSize={10}
									showPagination={false}
									sortable={false}
									className="transactions-table"
									getProps={() => transaction_columns_id}
								/>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Home;
