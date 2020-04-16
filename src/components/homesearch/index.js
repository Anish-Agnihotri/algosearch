import React from 'react';
import './index.css';

export default class HomeSearch extends React.Component {
	search = value => {
		console.log(value);
	};
	render() {
		return (
			<div className="home-search-bar">
				<input type="search" onKeyDown={e => e.key === 'Enter' ? this.search(): null} placeholder="Search by Address / TX ID / Block"/>
			</div>
		);
	}
}
