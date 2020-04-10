import React from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.css';
import { NavLink } from 'react-router-dom';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Load from '../../components/tableloading';
import AlgoIcon from '../../components/algoicon';
import {formatValue} from '../../constants';

class Transaction extends React.Component {
	constructor() {
		super();

		this.state = {
			txid: 0,
			transaction: [],
			loading: true,
		}
	}

	getTransaction = txid => {
		axios({
			method: 'get',
			url: `http://localhost:8000/transaction/${txid}`
		}).then(response => {
			this.setState({transaction: response.data, loading: false});
		}).catch(error => {
			console.log("Exception when retrieving transaction details: " + error);
		})
	};

	componentDidMount() {
		const { txid } = this.props.match.params;
		this.setState({txid: txid});
		document.title=`AlgoSearch | Transaction ${txid}`;
		this.getTransaction(txid);
	}

	render() {
		return (
			<Layout>
				<Breadcrumbs
					name={`Transaction Details`}
					parentLink="/transactions"
					parentLinkName="Transactions"
					currentLinkName={`Transaction Details`}
				/>
				<div className="block-table">
					<span>Transaction Details</span>
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
									<td>ID</td>
									<td>{this.state.loading ? <Load /> : this.state.txid}</td>
								</tr>
								<tr>
									<td>Round</td>
									<td>{this.state.loading ? <Load /> : <NavLink to={`/block/${this.state.transaction.round}`}>{this.state.transaction.round}</NavLink>}</td>
								</tr>
								<tr>
									<td>Type</td>
									<td>{this.state.loading ? <Load /> : <span className="type noselect">{this.state.transaction.type}</span>}</td>
								</tr>
								<tr>
									<td>Sender</td>
									<td>{this.state.loading ? <Load /> : <NavLink to={`/address/${this.state.transaction.from}`}>{this.state.transaction.from}</NavLink>}</td>
								</tr>
								<tr>
									<td>Receiver</td>
									<td>{this.state.loading ? <Load /> : <NavLink to={`/address/${this.state.transaction.payment.to}`}>{this.state.transaction.payment.to}</NavLink>}</td>
								</tr>
								<tr>
									<td>Amount</td>
									<td>{this.state.loading ? <Load /> : (
										<div>
											{formatValue(this.state.transaction.payment.amount / 1000000)}
											<AlgoIcon />
										</div>
									)}</td>
								</tr>
								<tr>
									<td>Fee</td>
									<td>{this.state.loading ? <Load /> : (
										<div>
											{formatValue(this.state.transaction.fee / 1000000)}
											<AlgoIcon />
										</div>
									)}</td>
								</tr>
								<tr>
									<td>First round</td>
									<td>{this.state.loading ? <Load /> : <NavLink to={`/block/${this.state.transaction["first-round"]}`}>{this.state.transaction["first-round"]}</NavLink>}</td>
								</tr>
								<tr>
									<td>Last round</td>
									<td>{this.state.loading ? <Load /> : <NavLink to={`/block/${this.state.transaction["last-round"]}`}>{this.state.transaction["last-round"]}</NavLink>}</td>
								</tr>
								<tr>
									<td>Timestamp</td>
									<td>{this.state.loading ? <Load /> : moment.unix(this.state.transaction.timestamp).format("LLLL")}</td>
								</tr>
								<tr>
									<td>Base 64</td>
									<td>
										{this.state.loading ? <Load /> : (
											<div>
												{this.state.transaction.noteb64 && this.state.transaction.noteb64 !== '' ? (
													<div>
														<div>
															<span>Base 64:</span>
															<textarea defaultValue={this.state.transaction.noteb64} readOnly></textarea>
														</div>
														<div>
															<span>Converted:</span>
															<textarea defaultValue={atob(this.state.transaction.noteb64)} readOnly></textarea>
														</div>
													</div>
												) : null}
											</div>
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="block-table">
					<span>Miscellaneous Details</span>
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
									<td>From rewards</td>
									<td>{this.state.loading ? <Load /> : (
										<div>
											{formatValue(this.state.transaction.fromrewards / 1000000)}
											<AlgoIcon />
										</div>
									)}</td>
								</tr>
								<tr>
									<td>To rewards</td>
									<td>{this.state.loading ? <Load /> : (
										<div>
											{formatValue(this.state.transaction.payment.torewards / 1000000)}
											<AlgoIcon />
										</div>
									)}</td>
								</tr>
								<tr>
									<td>Genesis ID</td>
									<td>{this.state.loading ? <Load /> : this.state.transaction.genesisID}</td>
								</tr>
								<tr>
									<td>Genesis hash</td>
									<td>{this.state.loading ? <Load /> : this.state.transaction.genesishashb64}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Transaction;
