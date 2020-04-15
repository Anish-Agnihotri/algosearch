import React from 'react';
import axios from 'axios';
import './index.css';
import Layout from '../../components/layout';
import {formatValue, siteName} from '../../constants';
import Load from '../../components/tableloading';
import Statscard from '../../components/statscard';
import AlgoIcon from '../../components/algoicon';
import {NavLink} from 'react-router-dom';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

class Address extends React.Component {
	constructor() {
		super();

		this.state = {
			address: 0,
			data: [],
			loading: true
		}
	}

	getAddressData = address => {
		axios({
			method: 'get',
			url: `${siteName}/addressservice/${address}`
		}).then(response => {
			this.setState({data: response.data, loading: false});
		}).catch(error => {
			console.log("Exception when querying for address information: " + error);
		});
	};

	componentDidMount() {
		const { address } = this.props.match.params;
		this.setState({address: address});
		document.title=`AlgoSearch | Address ${address}`;
		this.getAddressData(address);
	}

	render() {
		const columns = [
			{Header: '#', accessor: 'round', Cell: props => <span className="rownumber">{props.index + 1}</span>},
			{Header: 'Round', accessor: 'round', Cell: props => <NavLink to={`/block/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'TX ID', accessor: 'tx', Cell: props => <NavLink to={`/tx/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'From', accessor: 'from', Cell: props => this.state.address === props.value ? <span className="nocolor">{props.value}</span> : <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>}, 
			{Header: '', accessor: 'from', Cell: props => this.state.address === props.value ? <span className="type noselect">OUT</span> : <span className="type type-width-in noselect">IN</span>},
			{Header: 'To', accessor: 'payment.to', Cell: props => this.state.address === props.value ? <span className="nocolor">{props.value}</span> : <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>},
			{Header: 'Amount', accessor: 'payment.amount', Cell: props => <span>{formatValue(props.value / 1000000)} <AlgoIcon /></span>},
			{Header: 'Time', accessor: 'round', Cell: props=> <span className="nocolor">some long stamp</span>}
		];

		return (
			<Layout data={{
				"address": this.state.address,
				"balance": formatValue(this.state.data.amount / 1000000)
			}}
			addresspage>
				<div className="cardcontainer address-cards">
					<Statscard
						stat="Total transactions"
						value={this.state.loading ? <Load /> : 0}
					/>
					<Statscard
						stat="Rewards"
						value={this.state.loading ? <Load /> : (
							<div>
								{formatValue(this.state.data.rewards / 1000000)}
								<AlgoIcon />
							</div>
						)}
					/>
					<Statscard
						stat="Pending rewards"
						value={this.state.loading ? <Load /> : (
							<div>
								{formatValue(this.state.data.pendingrewards / 1000000)}
								<AlgoIcon />
							</div>
						)}
					/>
					<Statscard
						stat="Status"
						value={this.state.loading ? <Load /> : (
							<div>
								<div className={`status-light ${this.state.data.status === "Offline" ? "status-offline" : "status-online"}`}></div>
								<span>{this.state.data.status}</span>
							</div>
						)}
					/>
				</div>
				<div className="block-table addresses-table">
					<span>Latest {this.state.loading ? 0 : this.state.data.confirmed_transactions.length} transactions {this.state.loading !== true && this.state.data.confirmed_transactions.length > 24 ? <NavLink to={`/addresstx/${this.state.address}`} className="viewmore">View more</NavLink>: null }</span>
					<div>
						<ReactTable
							data={this.state.data.confirmed_transactions}
							columns={columns}
							loading={this.state.loading}
							defaultPageSize={25}
							showPagination={false}
							sortable={false}
							className="transactions-table addresses-table-sizing"
						/>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Address;
