import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");
  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // setValue({
    //   [name]: value
    // });

    state.kycAddress = value;
  }


  const handleKycSubmit = async () => {
    const {kycAddress, accounts} = state;
    // await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
    console.log(99900, state.contract[2].kycArtifact.methods)
    await state.contract[2].kycArtifact.methods.setKycCompleted(kycAddress).send({from: accounts[0]});
    alert("Account "+kycAddress+" is now whitelisted");
  }


  const TokenSaleAddress = () => {
    const tokenSaleArtifact = state.contract.find(c => c.tokenSaleArtifact);
    {/* This came from MyTokenSale.json. networks.5777.address */}

    return (<h3>address: {tokenSaleArtifact.tokenSaleArtifact._address}</h3>);
  }

  const buyToken = async () => {
    const {accounts} = state;
    const tokenSaleArtifact = await state.contract.find(c => c.tokenSaleArtifact);

    tokenSaleArtifact.tokenSaleArtifact.methods.buyTokens(accounts[0]).send({from: accounts[0], value: 1});
  }

  // const demo =
  //   <>
  //     <Cta />
  //     <div className="contract-container">
  //       <Contract value={value} />
  //       <ContractBtns setValue={setValue} />
  //     </div>
  //     <Desc />
  //   </>;
  const demo =
    <>
      <h1>Capuccino Token for StarDucks</h1>
      <h2>Enable your account</h2>
      Address to allow: <input type="text" name="kycAddress" value={state.kycAddress} onChange={handleInputChange} />
      <button type="button" onClick={handleKycSubmit}>Add Address to Whitelist</button>
      <TokenSaleAddress />
      <h3>Your current token : {state.userTokens} CAPPU</h3>
      <button type="button" onClick={buyToken}>Buy 1 token</button>
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;
