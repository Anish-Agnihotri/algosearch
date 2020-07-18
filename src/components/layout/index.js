import React from 'react';
import moment from 'moment';
import './index.css';

import AddressHeader from '../addressheader';
import HeaderSearch from '../headersearch';
import MainHeader from '../mainheader';
import Footer from '../footer';
import HomeHeader from '../homeheader';

class Layout extends React.Component {
	state = {
		scroll: false
	};

	componentDidMount() {
		// Moment global setup
		moment.updateLocale('en', {
			relativeTime: {
				s: number=>number + " seconds",
			}
		});
		// Check for scroll to top button position
		window.addEventListener('scroll', this.renderScrollTop.bind(this));
	}

	// Scroll to top button — render behaviour
	renderScrollTop() {
		let scroll_position = window.pageYOffset;

		if (!this.state.scroll && scroll_position > 500) {
			this.setState({scroll: true});
		} else if (this.state.scroll && scroll_position <= 500) {
			this.setState({scroll: false});
		}
	}

	// Scroll to top button — scroll up behaviour
	scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}

	render() {
		return (
			<div className="layout">
				<div className="topheader">
					<div className="sizer">
						<HeaderSearch />
					</div>
				</div>
				<div className="bottomheader">
					<div className="sizer">
						<MainHeader />
					</div>
				</div>
				{this.props.addresspage ? (
					<AddressHeader data={this.props.data} />
				) : null}
				{this.props.homepage ? (
					<HomeHeader synced={this.props.synced} />
				) : null}
				<div className={`content ${this.props.homepage ? "content-shortened" : ""}`}>
					<div className="sizer">
						{this.props.children}
					</div>
				</div>
				<div className="footer">
					<div className="sizer">
						<Footer />
					</div>
				</div>
				<button className={`scrolltop ${this.state.scroll ? '' : 'hiddenscroll'}`} onClick={this.scrollToTop}>➜</button>
			</div>
		);
	}
}

export default Layout;
