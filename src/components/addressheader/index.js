import React from 'react';
import AlgoIcon from '../../components/algoicon';
import CopyAddress from './copyaddress';
import QRAddress from './qraddress';
import './index.css';

import wallet from './wallet.svg';

class AddressHeader extends React.Component {
	render() {
		return (
			<div className="address-header">
				<div className="sizer">
					<div>
						<div>
							<h3>Address Information <CopyAddress address={this.props.data.address} /><QRAddress address={this.props.data.address} /></h3>
							<p>{this.props.data.address}</p>
						</div>
						<div>
							<h6>Algo Balance<img src={wallet} alt="Wallet icon" /></h6>
							<p><AlgoIcon /> {this.props.data.balance}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddressHeader;
