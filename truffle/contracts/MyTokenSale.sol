// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./CrowdSale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {
    KycContract kyc;

    event Milo(uint x);

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
        public
    {
        emit Milo(20161107);
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);

        require(kyc.kycCompleted(beneficiary), "KYC not completed yet, aborting");
    }

    function moka() public returns(uint) {
        emit Milo(19850715);

        return 19850715;
    }
}