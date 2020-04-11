import React from 'react';
import {NavLink} from 'react-router-dom';
import './index.css';

class Breadcrumbs extends React.Component {
	render() {
		return (
			<div className={`breadcrumbs ${this.props.address && this.props.address !== '' ? "breadcrumbs-address-tx" : null}`}>
				<div>
					<h1>{this.props.name}</h1>
					{this.props.address && this.props.address !== '' ? <span>{this.props.address}</span> : null}
				</div>
				<div>
					<p><NavLink to={this.props.parentLink}>{this.props.parentLinkName}</NavLink> <span className="noselect">/</span> {this.props.currentLinkName}</p>
				</div>
			</div>
		);
	}
}

export default Breadcrumbs;
