import './styles/App.css';
import React, { useEffect, useState } from "react";
import Header from './components/Header';
import Footer from './components/Footer';
import { config } from './config/config'

const ERROR_WALLET = "Make sure you have metamask or other extension wallet!";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [currentNetwork, setCurrentNetwork] = useState(undefined);

  const validateCorrectNetwork = async (ethereum) => {
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("current chain is: " + chainId);
    if (chainId !== config.rinkeby_chain) {
      alert("You are not connected to the Rinkeby Test Network!");
      return false;
    } else {
      return true;
    }
  }

  const requestSwitchNetwork = async (ethereum) => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.rinkeby_chain }],
      });
      setCurrentNetwork(config.rinkeby_chain);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: 'config.rinkeby_chain', rpcUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' }],
          });
        } catch (addError) {
          alert('Cannot import Rinkeby Network')
        }
      }
    }

  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert(ERROR_WALLET)
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const currentNetWork = await ethereum.request({ method: 'eth_chainId' });
    setCurrentNetwork(currentNetWork);

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)

      const isCorrectChain = await validateCorrectNetwork(ethereum);

      if (!isCorrectChain) {
        requestSwitchNetwork();
      }

    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert(ERROR_WALLET);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      const isCorrectChain = await validateCorrectNetwork(ethereum);

      if (!isCorrectChain) {
        requestSwitchNetwork();
      }

    } catch (error) {
      console.log(error)
    }
  }

  const verifyChain = async () => {
    if (currentNetwork === undefined || currentNetwork === '' || currentNetwork !== config.rinkeby_chain) {
      try {
        const { ethereum } = window;
        await requestSwitchNetwork(ethereum)

      } catch (error) {
        alert(ERROR_WALLET);
      }

    }
  }

  const handleChangeChain = async (chainId) => {
    setCurrentNetwork(chainId);
  }

  useEffect(() => {
    try {
      const { ethereum } = window;
      ethereum.on('chainChanged', handleChangeChain);
    } catch (e) {
      alert(ERROR_WALLET)
    }

    return () => {
      try {
        const { ethereum } = window;
        ethereum.removeListener('chainChanged', handleChangeChain);
      } catch (e) {
        alert(ERROR_WALLET)
      }
    }

  }, [])

  useEffect(() => {
    checkIfWalletIsConnected();

    return () => {
    }
  }, [])

  useEffect(() => {
    verifyChain();
  }, [currentNetwork])

  return (
    <div className="App">
      <div className="container">

        <Header
          currentAccount={currentAccount}
          connectWallet={connectWallet}
          currentChain={currentNetwork}
        />

        <Footer />
      </div>
    </div>
  );
};

export default App;
