import React from 'react';
import {NavLink} from 'react-router-dom';
import './index.css';

class Breadcrumbs extends React.Component {
	render() {
		return (
			<div className="breadcrumbs">
				<div>
					<h1>{this.props.name}</h1>
				</div>
				<div>
					<p><NavLink to={this.props.parentLink}>{this.props.parentLinkName}</NavLink> <span className="noselect">/</span> {this.props.currentLinkName}</p>
				</div>
			</div>
		);
	}
}

export default Breadcrumbs;
