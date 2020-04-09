import React from 'react';
import axios from 'axios';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

/*
	TODO:
	2. Isolate block number to stats
	3. Styling react
	4. Column cell linking, etc.
*/
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
			url: `http://localhost:8000/all/blocks/${headBlock}/${this.state.pageSize}/0` // Use pageSize from state
		}).then(response => {
			this.setState({blocks: response.data}); // Set blocks to new data to render
		})
	};

	// Get initial blocks on load
	getBlocks = () => {
		// Call stats to get current round number
		axios({
			method: 'get',
			url: 'http://localhost:8000/all/currentblock'
		}).then(response => {
			// Use current round number to retrieve last 25 blocks
			axios({
				method: 'get',
				url: `http://localhost:8000/all/blocks/${response.data.round + 1}/25/0`,
			}).then(response => {
				this.setState({
					blocks: response.data, // Set blocks data
					current_round: response.data[0].round, // Set current_round to highest round
					pages: Math.ceil(response.data[0].round / 25), // Set pages to rounded up division
					loading: false // Set loading to false
				});
			})
		})
	};

	componentDidMount() {
		this.getBlocks(); // Get initial blocks on load
	}

	render() {
		// Table columns
		const columns = [
			{Header: 'Round', accessor: 'round'}, 
			{Header: 'Transactions', accessor: 'transactions'}, 
			{Header: 'Proposed by', accessor: 'proposer'}, 
			{Header: 'Time', accessor: 'timestamp'}
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
						value={this.state.loading ? "Loading..." : this.state.current_round}
					/>
					<Statscard
						stat="Average Block Time"
						value="98.201 Billion"
					/>
					<Statscard
						stat="Reward Rate"
						value="98.201 Billion"
					/>
				</div>
				<div className="blockTable">
					<div>
					
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
							manual
						/>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Blocks;
