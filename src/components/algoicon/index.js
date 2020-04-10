import React from 'react';
import './index.css';

import algo from './algo.svg';

export default class AlgoIcon extends React.Component {
	render() {
		return (
			<img src={algo} draggable="false" alt="Algorand icon" className="algo-icon noselect"/>
		);
	}
}
