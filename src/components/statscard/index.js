import React from 'react';
import './index.css';

class Statscard extends React.Component {
	render() {
		return (
			<div className="statscard">
				<h2>{this.props.stat}</h2>
				<span>{this.props.value}</span>
			</div>
		);
	}
}

export default Statscard;
