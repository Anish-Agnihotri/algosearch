import React from 'react';
import './index.css';

class Footer extends React.Component {
	render() {
		return (
			<div className="footerItem">
				<div>
					<p>AlgoSearch &copy; 2020. Built with love by {" "}
						<a href="https://anishagnihotri.com/" target="_blank" rel="noopener noreferrer">Anish Agnihotri</a>.
					</p>
				</div>
				<div>
					<a href="https://github.com/anish-agnihotri/algosearch" target="_blank" rel="noopener noreferrer">GitHub</a>
					<a href="mailto:contact@algosearch.io">Contact Us</a>
				</div>
			</div>
		);
	}
}

export default Footer;
