import React from 'react';
import { NavLink } from 'react-router-dom';
import { HamburgerButton } from 'react-hamburger-button';
import './index.css';

import logo from './logo.png';

class MainHeader extends React.Component {
	constructor() {
		super();

		this.state = {
			open: false,
		}
	}
	updateDimensions = e => {
		if (window.innerWidth > 950) {
			this.setState({open: false});
		}
	}
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions.bind(this));
	}
	render() {
		return (
			<div className="mainheader">
				<div className="logo">
					<NavLink to="/">
						<img src={logo} alt="AlgoSearch logo" />
					</NavLink>
				</div>
				<div className="menu">
					<nav>
						<ul>
							<li><NavLink to="/" exact>Home</NavLink></li>
							<li><NavLink to="/blocks">Blocks</NavLink></li>
							<li><NavLink to="/transactions">Transactions</NavLink></li>
							<li><NavLink to="/dev">Developer APIs</NavLink></li>
						</ul>
					</nav>
					<div className="hamburger">
						<HamburgerButton
							open={this.state.open}
							onClick={() => this.setState(previous => ({open: !previous.open}))}
							width={25}
							height={12}
							strokeWidth={2}
							color='#5a728c'
							animationDuration={0.5}
						/>
					</div>
				</div>
				<div className={`menu-mobile ${this.state.open ? "shown" : "hidden"}`}>
					<nav>
						<ul>
							<li><NavLink to="/" exact>Home</NavLink></li>
							<li><NavLink to="/blocks">Blocks</NavLink></li>
							<li><NavLink to="/transactions">Transactions</NavLink></li>
							<li><NavLink to="/dev">Developer APIs</NavLink></li>
						</ul>
					</nav>
				</div>
			</div>
		);
	}
}

export default MainHeader;
