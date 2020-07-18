import React from 'react';
import axios from 'axios'
import {siteName} from '../../constants';
import {withRouter} from 'react-router-dom';
import './index.css';

class HomeSearch extends React.Component {
	search = () => {
		let search;
		if (this.state.query) {
			search = this.state.query;
		} else {
			search = "";
		}
		axios({
			method: 'get',
			url: `${siteName}/detect/${search}`
		}).then(response => {
			switch (response.data) {
				case 'block':
					this.props.history.push(`/block/${search}`);
					break;
				case 'transaction':
					this.props.history.push(`/tx/${search}`);
					break;
				case 'address':
					this.props.history.push(`/address/${search}`);
					break;
				default:
					this.props.history.push("/404");
					break;
			}
		}).catch(() => {
			this.props.history.push("/404");
		})
	}
	render() {
		return (
			<div className="home-search-bar">
				<input type="search" aria-label="Search by Address, Transaction ID, or Block" onChange={e => this.setState({query: e.target.value})} onKeyDown={e => e.key === 'Enter' ? this.search(): null} placeholder="Search by Address / TX ID / Block"/>
			</div>
		);
	}
}

export default withRouter(HomeSearch);
