import React from 'react';
import ReactTooltip from "react-tooltip";

export default class CopyAddress extends React.Component {
	constructor() {
		super();
		
		this.state = {
			copied: false,
		};
	}

	copyAddress = () => {
		navigator.clipboard.writeText(this.props.address);
		this.setState({copied: true}, () => {
			setTimeout(() => {
				this.setState({copied: false})
			}, 1000);
		})
	};

	render() {
		return (
			this.props.address !== '' ? (
				<>
				<ReactTooltip id='copy' className='copy-style' place="top" type="dark" effect="solid">
					<span>{this.state.copied ? 'Address copied' : '    Copy Address    '}</span>
				</ReactTooltip>
				<button className="address-button" onClick={this.copyAddress} data-tip data-for='copy'>
					{this.state.copied ? (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 22.633">
							<path d="M53.639,80.177,36.73,97.086l-6.213-6.213a.771.771,0,0,0-1.091,0l-1.818,1.818a.771.771,0,0,0,0,1.091l8.576,8.576a.771.771,0,0,0,1.091,0L56.548,83.086a.771.771,0,0,0,0-1.091L54.73,80.177A.771.771,0,0,0,53.639,80.177Z" transform="translate(-27.382 -79.951)" fill="#536d93"/>
						</svg>
					) : (
						<svg className="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
							<path d="M21.31,3.238,18.762.69A2.357,2.357,0,0,0,17.1,0H8.643A2.357,2.357,0,0,0,6.286,2.357V4.714H2.357A2.357,2.357,0,0,0,0,7.071V22.786a2.357,2.357,0,0,0,2.357,2.357h11a2.357,2.357,0,0,0,2.357-2.357V20.429h3.929A2.357,2.357,0,0,0,22,18.071V4.9a2.357,2.357,0,0,0-.69-1.667ZM13.063,22.786H2.652a.3.3,0,0,1-.295-.295V7.366a.3.3,0,0,1,.295-.295H6.286v11a2.357,2.357,0,0,0,2.357,2.357h4.714v2.063A.3.3,0,0,1,13.063,22.786Zm6.286-4.714H8.938a.3.3,0,0,1-.295-.295V2.652a.3.3,0,0,1,.295-.295h5.205V6.679a1.179,1.179,0,0,0,1.179,1.179h4.321v9.92a.3.3,0,0,1-.295.295ZM19.643,5.5H16.5V2.357h.473a.3.3,0,0,1,.208.086l2.375,2.375a.3.3,0,0,1,.086.208Z" fill="#536d93"/>
						</svg>
					)}
				</button>
				</>
			) : null
		);
	}
}
