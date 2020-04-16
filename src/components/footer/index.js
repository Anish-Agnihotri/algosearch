import React from 'react';
import './index.css';

class Footer extends React.Component {
	render() {
		return (
			<div className="footerItem">
				<p>&copy; 2020 AlgoSearch. Design inspired by {" "}
					<a href="https://libexplorer.com/" target="_blank" rel="noopener noreferrer">LibExplorer</a>.
				</p>
			</div>
		);
	}
}

export default Footer;
