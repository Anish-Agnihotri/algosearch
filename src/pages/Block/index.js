import React from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.css';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

class Block extends React.Component {
	constructor() {
		super();

		this.state = {
			blocknum: 0,
			data: [],
			loading: true,
		}
	}

	getBlock = blockNum => {
		axios({
			type: 'get',
			url: `http://localhost:8000/block/${blockNum}`
		}).then(response => {
			this.setState({data: response.data, loading: false});
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
						<table cellspacing="0">
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
									<td>{this.state.loading ? null : this.state.data.proposer}</td>
								</tr>
								<tr>
									<td>Block hash</td>
									<td>{this.state.loading ? null : this.state.data.hash}</td>
								</tr>
								<tr>
									<td>Previous block hash</td>
									<td>{this.state.loading ? null : this.state.data.previousBlockHash}</td>
								</tr>
								<tr>
									<td>Seed</td>
									<td>{this.state.loading ? null : this.state.data.seed}</td>
								</tr>
								<tr>
									<td>Created at</td>
									<td>{this.state.loading ? null : moment.unix(this.state.data.timestamp).format("LLLL")}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="block-table">
					<span>Governance Overview</span>
				{/*TODO: Transactions table */}
					<div>
						<table cellspacing="0">
							<thead>	
								<tr>
									<th>Identifier</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Current protocol</td>
									<td>{this.state.loading ? null : this.state.data.currentProtocol}</td>
								</tr>
								<tr>
									<td>Next protocol</td>
									<td>{this.state.loading ? null : this.state.data.nextProtocol}</td>
								</tr>
								<tr>
									<td>Next protocol approvals</td>
									<td>{this.state.loading ? null : this.state.data.nextProtocolApprovals}</td>
								</tr>
								<tr>
									<td>Next protocol vote before</td>
									<td>{this.state.loading ? null : this.state.data.nextProtocolVoteBefore}</td>
								</tr>
								<tr>
									<td>Next protocol switch on</td>
									<td>{this.state.loading ? null : this.state.data.nextProtocolSwitchOn}</td>
								</tr>
								<tr>
									<td>Upgrade proposal</td>
									<td>{this.state.loading ? null : this.state.data.upgradePropose}</td>
								</tr>
								<tr>
									<td>Upgrade approved</td>
									<td>{this.state.loading ? null : this.state.data.upgradeApprove}</td>
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
