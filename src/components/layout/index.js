import React from 'react';
import './index.css';

import HeaderSearch from '../headersearch';
import MainHeader from '../mainheader';

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
				<div className="content">
					<div className="sizer">
						{this.props.children}
					</div>
				</div>
				<div className="footer">
					<div className="sizer">
					
					</div>
				</div>
			</div>
		);
	}
}

export default Layout;
