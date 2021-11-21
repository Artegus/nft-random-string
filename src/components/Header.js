import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import web3 from 'web3'
import RandomString from '../utils/RandomString.json'
import { config } from '../config/config';
import Account from './Account';
import Chain from './Chain';

const OPENSEA_LINK = `https://testnets.opensea.io/assets/${config.contractAddress}/`;
const TOTAL_MINT_COUNT = 50;


const defaultState = {
    isMinting: false,
    isComplete: false,
}

const defatulMintingResult = {
    txs: '',
    opensea: '',
    tokenId: ''
}

const Header = ({
    currentAccount,
    connectWallet,
    currentChain
}) => {

    const [totalMinted, setTotalMinted] = useState(0)
    const [statusMinting, setStatusMinting] = useState(defaultState)
    const [mintingResult, setMintingResult] = useState(defatulMintingResult)

    const requestTotalMinted = async (connectedContract) => {
        let totalMintedRaw = await connectedContract.getTotalMinted();
        let totalMinted = web3.utils.toNumber(totalMintedRaw._hex);

        setTotalMinted(totalMinted);
    }

    const askContractToMintNft = async () => {

        setMintingResult(defatulMintingResult);
        setStatusMinting(defaultState);

        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(config.contractAddress, RandomString.abi, signer);

                connectedContract.on("RandomStringMinted", (from, tokenId) => {
                    if (from.toLowerCase() === currentAccount.toLowerCase()) {
                        setMintingResult({
                            ...mintingResult,
                            tokenId: `${tokenId.toNumber()}`
                        })
                        console.log(`Hey there! We've minted your NFT. 
                        It may be blank right now. It can take a max of 10 min to show up on OpenSea. 
                        Here's the link: <${OPENSEA_LINK}${tokenId.toNumber()}>`)
                    }
                });

                let nftTxn = await connectedContract.makeARandomString();
                
                setStatusMinting({
                    ...statusMinting, isMinting: true
                })

                await nftTxn.wait();

                setStatusMinting({
                    isComplete: true,
                    isMinting: false,
                })

                await requestTotalMinted(connectedContract)
                
                setMintingResult({
                    ...mintingResult,
                    txs: `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
                    opensea: `${OPENSEA_LINK}${totalMinted - 1}`
                })
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
        if (currentAccount !== undefined) {
            getAmountMinted();
        }
        return () => {

        }
    }, [currentAccount])

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
                Each unique. Each beautiful. Just "random" strings.
            </p>
            <p style={{ color: 'white' }}>{totalMinted}/{TOTAL_MINT_COUNT}</p>

            {currentAccount === undefined ?
                renderNotConnectedContainer() :
                renderMintButton()
            }

            {statusMinting.isMinting && (
                <p className="mint-status">
                    Minting...
                </p>
            )}

            {statusMinting.isComplete && (
                <div className="mint-status">
                    <a href={mintingResult.txs} target='_blank' >Transaction</a>
                    <a href={mintingResult.opensea} target='_blank' >NFT on testnet Opensea</a>
                </div>
            )}

        </div>

    )
}

export default Header
