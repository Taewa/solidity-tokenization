require("dotenv").config({path: "../.env"});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");
const expect = chai.expect;

contract("MyTokenSale test", async (accounts) => {
    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        const instance = await MyToken.deployed();

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("should exist all tokens in the MyTokenSale smart contract by default", async () => {
        const instance = await MyToken.deployed();
        const myTokenSaleBalance = await instance.balanceOf(MyTokenSale.address);
        const totalSupply = await instance.totalSupply();

        expect(myTokenSaleBalance).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy tokens", async () => {
        const myTokenInstance = await MyToken.deployed();
        const myTokenSaleInstance = await MyTokenSale.deployed();
        const balanceBefore = await myTokenInstance.balanceOf(deployerAccount); // 0
        const expectedBalance = await balanceBefore.add(new BN(1)); // 1

        await myTokenSaleInstance.moka();

        expect(myTokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(expectedBalance);
    });
});