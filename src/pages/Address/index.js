import React from 'react';
import axios from 'axios';
import Layout from '../../components/layout';
import {formatValue} from '../../constants';
import Load from '../../components/tableloading';
import Statscard from '../../components/statscard';
import AlgoIcon from '../../components/algoicon';

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
			url: `http://localhost:8000/address/${address}`
		}).then(response => {
			console.log(response.data);
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
			</Layout>
		);
	}
}

export default Address;
