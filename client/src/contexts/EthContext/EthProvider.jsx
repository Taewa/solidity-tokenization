import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {

      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const artifacts = Object.keys(artifact);
        const contracts = [];
        console.log('smart contract artifacts', artifact)

        artifacts.forEach((contractName, _) => {
          const contractJson = artifact[contractName];
          const { abi } = contractJson;

          let address, contract;

          try {
            address = contractJson.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);
            contracts.push({[contractName]: contract});
          } catch (err) {
            console.error(err);
          }
        });

        // const { abi } = artifact;
        // let address, contract;
        // try {
        //   address = artifact.networks[networkID].address;
        //   contract = new web3.eth.Contract(abi, address);
        // } catch (err) {
        //   console.error(err);
        // }

        updateUserToken(contracts);
        listenToTokenTransfer(contracts);

        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract: contracts }
        });
      }
    }, []);

  const updateUserToken = async (contracts) => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    const toeknArtifactObj = contracts.find(c => c.tokenArtifact);
    const {tokenArtifact} = toeknArtifactObj;
    const userTokens = await tokenArtifact.methods.balanceOf(accounts[0]).call();

    dispatch({
      type: actions.init,
      data: { userTokens }
    });
  }

  const listenToTokenTransfer = async (contracts) => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    const toeknArtifactObj = contracts.find(c => c.tokenArtifact);
    const {tokenArtifact} = toeknArtifactObj;

    tokenArtifact.events.Transfer({to: accounts[0]}).on('data', (e) => {
      updateUserToken(contracts);
    });
  }

  useEffect(() => {
    const tryInit = async () => {
      try {
        const tokenArtifact = require("../../contracts/MyToken.json");
        const tokenSaleArtifact = require("../../contracts/MyTokenSale.json");
        const kycArtifact = require("../../contracts/KycContract.json");
        const contracts = {
          tokenArtifact,
          tokenSaleArtifact,
          kycArtifact,
        }

        init(contracts);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
