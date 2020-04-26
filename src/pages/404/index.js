import React from 'react';
import './index.css';
import Layout from '../../components/layout';
import { NavLink } from 'react-router-dom';

import image from './404.svg';

export default class FourOhFour extends React.Component {
	render() {
		return (
			<Layout>
				<div className="FourOhFour">
					<img src={image} alt="404" />
					<h1>Oops!</h1>
					<p>It looks like this page has been lost.</p>
					<p>While we try to find it, how about taking a trip back home?</p>
					<NavLink to="/home">Return home</NavLink>
				</div>
			</Layout>
		);
	}
}
