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
import Statscard from '../../components/statscard';
import Load from '../../components/tableloading';
import HomeSearch from '../../components/homesearch';

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
			const synced = Math.ceil(response.data.blocks[0].round/100)*100 === Math.ceil(response.data.ledger.round/100)*100 ? true : false;
			this.setState({blocks: response.data.blocks, transactions: response.data.transactions, ledger: response.data.ledger, synced: synced, loading: false});
		}).catch(error => {
			console.log("Error when retrieving latest statistics: " + error);
		})
		setTimeout(this.getLatest, 1000);
	};

	getPrice = () => {
		axios({
			method: 'get',
			url: 'https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd'
		}).then(response => {
			this.setState({price: response.data.algorand.usd});
		}).catch(error => {
			console.log("Error when retrieving Algorand price from CoinGecko: " + error);
		})
	}

	componentDidMount() {
		this.getPrice();
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
			{Header: 'Amount', accessor: 'payment.amount', Cell: props => <span>{<span className="nocolor">{formatValue(props.value / 1000000)}</span>} <AlgoIcon /></span>},
			{Header: 'Time', accessor: 'timestamp', Cell: props => <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
		];
		const transaction_columns_id = {id: "home-latest-transaction-sizing"};

		return (
			<Layout synced={this.state.synced} homepage>
				<HomeSearch />
				<div className="cardcontainer address-cards home-cards">
					<Statscard
						stat="Latest Round"
						value={this.state.loading ? <Load /> : formatValue(this.state.ledger.round)}
					/>
					<Statscard
						stat="Online Stake"
						value={this.state.loading ? <Load /> : (
							<div>
								{formatValue(this.state.ledger.onlineMoney / 1000000)}
								<AlgoIcon />
							</div>
						)}
					/>
					<Statscard
						stat="Circulating supply"
						value={this.state.loading ? <Load /> : (
							<div>
								{formatValue(this.state.ledger.totalMoney / 1000000)}
								<AlgoIcon />
							</div>
						)}
					/>
					<Statscard
						stat="Algo Price"
						value={this.state.loading ? <Load /> : '$' + formatValue(this.state.price)}
					/>
				</div>
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
