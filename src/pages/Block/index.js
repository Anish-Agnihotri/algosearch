import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import './index.css';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AlgoIcon from '../../components/algoicon';
import Load from '../../components/tableloading';
import {formatValue, siteName} from '../../constants';

class Block extends React.Component {
	constructor() {
		super();

		this.state = {
			blocknum: 0,
			data: [],
			transactions: [],
			loading: true,
		}
	}

	getBlock = blockNum => {
		axios({
			type: 'get',
			url: `${siteName}/block/${blockNum}`
		}).then(response => {
			this.setState({data: response.data, transactions: response.data.txns.transactions, loading: false});
		}).catch(error => {
			console.log(`Exception when retrieving block #${blockNum}: ${error}`)
		})
	}

	componentDidMount() {
		const { blocknum } = this.props.match.params;
		this.setState({blocknum: blocknum});
		document.title=`AlgoSearch | Block ${blocknum}`;
		this.getBlock(blocknum);
	}

	render() {
		const columns = [
			{Header: 'Round', accessor: 'round', Cell: props => <NavLink to={`/block/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'TX ID', accessor: 'tx', Cell: props => <NavLink to={`/tx/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'Type', accessor: 'type', Cell: props => <span className="type noselect">{props.value}</span>},
			{Header: 'From', accessor: 'from', Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'To', accessor: 'payment.to', Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>},
			{Header: 'Amount', accessor: 'payment.amount', Cell: props => <span>{formatValue(props.value)} <AlgoIcon /></span>},
			{Header: 'Fee', accessor: 'fee', Cell: props => <span>{formatValue(props.value)} <AlgoIcon /></span>}
		];

		return (
			<Layout>
				<Breadcrumbs
					name={`Block #${this.state.blocknum}`}
					parentLink="/blocks"
					parentLinkName="Blocks"
					currentLinkName={`Block #${this.state.blocknum}`}
				/>
				<div className="block-table">
					<span>Block Overview</span>
					<div>
						<table cellSpacing="0">
							<thead>
								<tr>
									<th>Identifier</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Round</td>
									<td>{this.state.blocknum}</td>
								</tr>
								<tr>
									<td>Proposer</td>
									<td>{this.state.loading ? <Load/> : (<NavLink to={`/address/${this.state.data.proposer}`}>{this.state.data.proposer}</NavLink>)}</td>
								</tr>
								<tr>
									<td>Block hash</td>
									<td>{this.state.loading ? <Load/> : this.state.data.hash}</td>
								</tr>
								<tr>
									<td>Previous block hash</td>
									<td>{this.state.loading ? <Load/> : (<NavLink to={`/block/${parseInt(this.state.blocknum) - 1}`}>{this.state.data.previousBlockHash}</NavLink>)}</td>
								</tr>
								<tr>
									<td>Seed</td>
									<td>{this.state.loading ? <Load/> : this.state.data.seed}</td>
								</tr>
								<tr>
									<td>Created at</td>
									<td>{this.state.loading ? <Load/> : moment.unix(this.state.data.timestamp).format("LLLL")}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				{this.state.transactions && this.state.transactions.length > 0 ? (
					<div className="block-table">
						<span>Transactions</span>
						<div>
							<ReactTable
								data={this.state.transactions}
								columns={columns}
								loading={this.state.loading}
								defaultPageSize={5}
								pageSizeOptions={[5, 10, 15]}
								sortable={false}
								className="transactions-table"
							/>
						</div>
					</div>
				) : null}
				<div className="block-table">
					<span>Governance Overview</span>
					<div>
						<table cellSpacing="0">
							<thead>	
								<tr>
									<th>Identifier</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Current protocol</td>
									<td>{this.state.loading ? <Load/> : (<a href={this.state.data.currentProtocol} target="_blank" rel="noopener noreferrer">{this.state.data.currentProtocol}</a>)}</td>
								</tr>
								<tr>
									<td>Next protocol</td>
									<td>{this.state.loading ? <Load/> : (<a href={this.state.data.nextProtocol} target="_blank" rel="noopener noreferrer">{this.state.data.nextProtocol}</a>)}</td>
								</tr>
								<tr>
									<td>Next protocol approvals</td>
									<td>{this.state.loading ? <Load/> : this.state.data.nextProtocolApprovals}</td>
								</tr>
								<tr>
									<td>Next protocol vote before</td>
									<td>{this.state.loading ? <Load/> : this.state.data.nextProtocolVoteBefore}</td>
								</tr>
								<tr>
									<td>Next protocol switch on</td>
									<td>{this.state.loading ? <Load/> : this.state.data.nextProtocolSwitchOn}</td>
								</tr>
								<tr>
									<td>Upgrade proposal</td>
									<td>{this.state.loading ? <Load/> : this.state.data.upgradePropose}</td>
								</tr>
								<tr>
									<td>Upgrade approved</td>
									<td>{this.state.loading ? <Load/> : this.state.data.upgradeApprove}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Block;
