import React from 'react';
import './index.css';

export default class HomeFooter extends React.Component {
    render() {
        return (
            <div className="homefooter">
                <div>
                    <h3>About Algorand</h3>
                    <ul>
                        <li><a href="https://www.algorand.com/" target="_blank" rel="noopener noreferrer">What is Algorand?</a></li>
                        <li><a href="https://www.algorand.com/resources/white-papers" target="_blank" rel="noopener noreferrer">Official White Papers</a></li>
                        <li><a href="https://algorand.foundation/" target="_blank" rel="noopener noreferrer">Algorand Foundation</a></li>
                        <li><a href="https://www.algorand.com/what-we-do/faq" target="_blank" rel="noopener noreferrer">Frequently Asked Questions</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Getting Started</h3>
                    <ul>
                        <li><a href="https://github.com/algorand-devrel/hackathon" target="_blank" rel="noopener noreferrer">Develop with Algorand</a></li>
                        <li><a href="https://developer.algorand.org/" target="_blank" rel="noopener noreferrer">Algorand Developer Portal</a></li>
                        <li><a href="https://github.com/algorand" target="_blank" rel="noopener noreferrer">Contribute to Open Source</a></li>
                        <li><a href="https://forum.algorand.org/" target="_blank" rel="noopener noreferrer">Join the Discussion</a></li>
                    </ul>
                </div>
                <div>
                    <h3>In The News</h3>
                    <ul>
                        <li><a href="https://www.algorand.com/what-we-do/technology" target="_blank" rel="noopener noreferrer">Introduction to Algorand 2.0</a></li>
                        <li><a href="https://www.algorand.com/resources/blog/algorand-and-isda-asset-tokenization-and-programmatic-money" target="_blank" rel="noopener noreferrer">Asset Tokenization and Programmatic Money</a></li>
                        <li><a href="https://www.algorand.com/resources/blog/algorand-upgrades-protocol-with-improved-indexer" target="_blank" rel="noopener noreferrer">Improved Algorand Indexer and API</a></li>
                        <li><a href="https://www.algorand.com/resources/news/blockstack-and-algorand-adopt-clarity-smart-contract-language" target="_blank" rel="noopener noreferrer">Clarity Smart Contract Language</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}