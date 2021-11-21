import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import web3 from 'web3'
import RandomString from '../utils/RandomString.json'
import { config } from '../config/config';
import Account from './Account';
import Chain from './Chain';

const OPENSEA_LINK = `https://testnets.opensea.io/assets/${config.contractAddress}/`;
const TOTAL_MINT_COUNT = 50;


const Header = ({
    currentAccount,
    connectWallet,
    currentChain
}) => {

    const [totalMinted, setTotalMinted] = useState(0)

    const requestTotalMinted =  async (connectedContract) => {
        let totalMintedRaw = await connectedContract.getTotalMinted();
        let totalMinted = web3.utils.toNumber(totalMintedRaw._hex);

        setTotalMinted(totalMinted);
    }

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(config.contractAddress, RandomString.abi, signer);

                connectedContract.on("RandomStringMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber())
                    alert(`Hey there! We've minted your NFT. 
                        It may be blank right now. It can take a max of 10 min to show up on OpenSea. 
                        Here's the link: <${OPENSEA_LINK}${tokenId.toNumber()}>`)
                });

                let nftTxn = await connectedContract.makeARandomString();

                await nftTxn.wait();
                requestTotalMinted(connectedContract)
                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAmountMinted = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const connectedContract = new ethers.Contract(config.contractAddress, RandomString.abi, provider);

                requestTotalMinted(connectedContract)
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    const renderMintButton = () => (
        <button 
            onClick={currentChain === config.rinkeby_chain ? askContractToMintNft : null} 
            className="cta-button connect-wallet-button">
            {currentChain === config.rinkeby_chain ? "Mint NFT" : 'Please connect to rinkeby network'}
        </button>
    )

    useEffect(() => {
        getAmountMinted();
        return () => {

        }
    }, [])

    return (
        <div className="header-container">
            <div className='chain-container'>
                <Chain chainId={currentChain} />
            </div>
            <div className='account-container'>
                <Account account={currentAccount} />
            </div>
            <p className="header gradient-text">RandomStrings (RDS)</p>
            <p className="sub-text">
                Each unique. Each beautiful. Just random strings.

            </p>
            <p style={{ color: 'white' }}>{totalMinted}/{TOTAL_MINT_COUNT}</p>

            {currentAccount === undefined ?
                renderNotConnectedContainer() : 
                    renderMintButton()
            }
        </div>

    )
}

export default Header
