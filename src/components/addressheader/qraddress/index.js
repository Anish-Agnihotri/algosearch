import React from 'react';
import QRCode from 'qrcode.react';
import ReactTooltip from "react-tooltip";

import algoQRImage from './algosvg.svg';

export default class QRAddress extends React.Component {
	render() {
		return (
			this.props.address !== '' ? (
				<>
					<ReactTooltip id='qrcode' className="qr-style" place="bottom" type="dark" effect="solid">
						<QRCode 
							value={this.props.address}
							renderAs='svg'
							imageSettings={{
								'src': algoQRImage,
								'height': 40,
								'width': 40,
							}}
						/>
					</ReactTooltip>
					<button className="address-button qr" data-tip data-for='qrcode'>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
							<path d="M0,41.752H9.752V32H0Zm2.032-7.72H7.72V39.72H2.032ZM13,32v9.752h9.752V32Zm7.72,7.72H15.034V34.032h5.688ZM0,54.754H9.752V45H0Zm2.032-7.72H7.72v5.688H2.032Zm1.625,1.625H6.095V51.1H3.657Zm0-13H6.095v2.438H3.657ZM19.1,38.095H16.659V35.657H19.1ZM21.129,45h1.625v6.5h-6.5V49.878H14.628v4.876H13V45h4.876v1.625h3.251Zm0,8.126h1.625v1.625H21.129Zm-3.251,0H19.5v1.625H17.878Z" transform="translate(0 -32)" fill="#536d93"/>
						</svg>
					</button>
				</>
			) : null
		);
	}
}
