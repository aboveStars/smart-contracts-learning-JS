// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256; // for library..

    uint256 fee = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() >= fee, "FUND MORE BABE");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withDraw() public onlyOwner {
        /* for(startingIndex, endingIndex, step amount) */
        for (
            uint256 funderIndex = 0;
            funderIndex <= funders.length - 1;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0);

        /*
    We can send something with 3 different ways...

        1.TRANSFER
            payable(msg.sender).transfer(address(this).balance);
                * Differences msg.sender and payable(msg.sender):
                    msg.sender = address
                    payable(msg.sender) = payable address

        2.SEND
            bool sendSuccess = payable(msg.sender).send(address(this).balance);
            require(sendSuccess);

        3.CALL  */
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner() {
        /*

        _; means DO THE FUNCTION which you sticked....
            * if it was the in first place, it would first execute the code (ex. withdraw) (which we dont want) than checks owner...
            * in first or last, tx will be reverted...
                * But we can reduce gas usage with putting "_;" to the last.

        */
        require(msg.sender == owner, "OWNER ONLY");
        _;
    }
}
