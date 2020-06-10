import React from 'react';
import './index.css';

class Footer extends React.Component {
	render() {
		return (
			<div className="footerItem">
				<p>&copy; 2020 AlgoSearch. Developed by {" "}
					<a href="https://anishagnihotri.com/" target="_blank" rel="noopener noreferrer">Anish Agnihotri</a>.
				</p>
			</div>
		);
	}
}

export default Footer;
