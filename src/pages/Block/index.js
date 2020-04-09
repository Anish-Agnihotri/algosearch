import React from 'react';
import './index.css';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

class Block extends React.Component {
	constructor() {
		super();

		this.state = {
			blocknum: 0,
		}
	}
	componentDidMount() {
		const { blocknum } = this.props.match.params;
		this.setState({blocknum: blocknum});
		document.title=`AlgoSearch | Block ${blocknum}`;
	}
	render() {
		return (
			<Layout>
				<Breadcrumbs
					name={`Block #${this.state.blocknum}`}
					parentLink="/blocks"
					parentLinkName="Blocks"
					currentLinkName={`Block #${this.state.blocknum}`}
				/>
				<p>Block {this.state.blocknum}</p>
			</Layout>
		);
	}
}

export default Block;
