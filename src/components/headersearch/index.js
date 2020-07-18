import React from 'react';
import axios from 'axios';
import {siteName} from '../../constants';
import {withRouter} from 'react-router-dom';
import './index.css';

import algorand from './algorand.svg';

class HeaderSearch extends React.Component {
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
			<div className="search">
				<div className="searchbar">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" stroke="#fff">
						<path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"/>
					</svg>
					<input type="search" aria-label="Search by Address, Transaction ID, or Block" onChange={e => this.setState({query: e.target.value})} onKeyDown={e => e.key === 'Enter' ? this.search(): null} placeholder="Search by Address / TX ID / Block"/>
				</div>
				<div className="poweredlogo noselect">
					<p>Powered by{" "}
						<a href="https://www.algorand.com/" target="_blank" rel="noopener noreferrer">
							<img src={algorand} alt="Algorand logo"/>
						</a>
					</p>
				</div>
			</div>
		);
	}
}

export default withRouter(HeaderSearch);
