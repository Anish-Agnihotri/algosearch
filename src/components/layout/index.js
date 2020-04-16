import React from 'react';
import './index.css';

import AddressHeader from '../addressheader';
import HeaderSearch from '../headersearch';
import MainHeader from '../mainheader';
import Footer from '../footer';
import HomeHeader from '../homeheader';

class Layout extends React.Component {
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
				<div className="content">
					<div className="sizer">
						{this.props.children}
					</div>
				</div>
				<div className="footer">
					<div className="sizer">
						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default Layout;
