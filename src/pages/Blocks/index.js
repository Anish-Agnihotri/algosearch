import React from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.css';
import { NavLink } from 'react-router-dom';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AlgoIcon from '../../components/algoicon';
import Load from '../../components/tableloading';
import {siteName} from '../../constants';

class Blocks extends React.Component {
	constructor() {
		super();

		this.state = {
			blocks: [], // Blocks array
			pageSize: 25, // Default pageSize = 25
			pages: -1, // By default, pages to -1
			loading: true, // Loading true
		};
	}

	// Update page size
	updatePageSize = (pageIndex, pageSize) => {
		this.setState({
			pageSize: pageSize, // Set pageSize to new page size
			pages: Math.ceil(this.state.current_round / pageSize) // Set pages to new number of pages
		}, () => {
			this.updateBlocks(pageIndex); // Run update to get new data based on update page size and current index
		});
	};

	// Update blocks based on page number
	updateBlocks = pageIndex => {
		// Let the request headerblock be current_round - (current page * pageSize)
		let headBlock = this.state.current_round - (pageIndex * this.state.pageSize);

		axios({
			method: 'get',
			url: `${siteName}/all/blocks/${headBlock}/${this.state.pageSize}/0` // Use pageSize from state
		}).then(response => {
			this.setState({blocks: response.data}); // Set blocks to new data to render
		}).catch(error => {
			console.log("Exception when updating blocks: " + error);
		})
	};

	// Get initial blocks on load
	getBlocks = () => {
		// Call stats to get current round number
		axios({
			method: 'get',
			url: `${siteName}/stats`
		}).then(resp => {
			// Use current round number to retrieve last 25 blocks
			axios({
				method: 'get',
				url: `${siteName}/all/blocks/${resp.data.current_round + 1}/25/0`,
			}).then(response => {
				this.setState({
					blocks: response.data, // Set blocks data
					current_round: response.data[0].round, // Set current_round to highest round
					pages: Math.ceil(response.data[0].round / 25), // Set pages to rounded up division
					loading: false, // Set loading to false
					reward_rate: resp.data.reward_rate,
					avg_block_time: resp.data.avg_block_time
				});
			}).catch(error => {
				console.log("Exception when retrieving last 25 blocks: " + error);
			})
		}).catch(error => {
			console.log("Exception when retrieving current round number: " + error);
		})
	};

	componentDidMount() {
		this.getBlocks(); // Get initial blocks on load
		document.title="AlgoSearch | Blocks";
	}

	render() {
		// Table columns
		const columns = [
			{Header: 'Round', accessor: 'round', Cell: props => <NavLink to={`/block/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'Transactions', accessor: 'transactions'}, 
			{Header: 'Proposed by', accessor: 'proposer', Cell: props => <NavLink to={`/address/${props.value}`}>{props.value}</NavLink>}, 
			{Header: 'Time', accessor: 'timestamp', Cell: props => <span>{moment.unix(props.value).fromNow()}</span>}
		];

		return (
			<Layout>
				<Breadcrumbs
					name="Blocks"
					parentLink="/"
					parentLinkName="Home"
					currentLinkName="Blocks"
				/>
				<div className="cardcontainer">
					<Statscard
						stat="Latest round"
						value={this.state.loading ? <Load /> : this.state.current_round}
					/>
					<Statscard
						stat="Average Block Time"
						value={this.state.loading ? <Load /> : (<span>{this.state.avg_block_time}s</span>)}
					/>
					<Statscard
						stat="Reward Rate"
						value={this.state.loading ? <Load /> : (
							<div>
								{this.state.reward_rate}
								<AlgoIcon />
							</div>
						)}
					/>
				</div>
				<div className="table">
					<div>
						<p>{this.state.current_round} blocks found</p>
						<p>(Showing the last {this.state.pageSize} records)</p>
					</div>
					<div>
						<ReactTable
							pageIndex={0}
							pages={this.state.pages}
							data={this.state.blocks}
							columns={columns}
							loading={this.state.loading}
							pageSize={this.state.pageSize}
							defaultPageSize={25}
							pageSizeOptions={[25, 50, 100]}
							onPageChange={pageIndex => this.updateBlocks(pageIndex)}
							onPageSizeChange={(pageSize, pageIndex) => this.updatePageSize(pageIndex, pageSize)}
							sortable={false}
							className="blocks-table"
							manual
						/>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Blocks;
