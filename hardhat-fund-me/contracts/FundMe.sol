// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "./PriceConverter.sol";

// 798,631 gas for creating this contract
// 792,284 gas with constant
// 768,705 gas with immutable

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    // 21,459 WITH CONSTANT
    // 23,559 WITH-OUT CONSTANT

    uint256 public constant FEE = 50 * 1e18;
    // CONSTANT Variables can not be set even Constructors.

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    // Immutable variables can only be declared in Constructors. (so it means 1 time.)

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() >= FEE, "FUND MORE BABE");
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
        
        // TRANSFER
        // msg.sender = address
        // payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);

        // SEND
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess);

        */

        // call
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner() {
        // with not using require() we can reduce gas usage...
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    /*

    If somebody wants to interact with contract but not with usual ways...
        1.If a data with comes this TX, but this data NOT APPROPRITE ---> It triggers "fallback()"

        2.If no data comes with TX and there is "receive" -----> it triggers "reveive()"
            If no data comes with TX and there is no "receive" ----> It triggers "fallback"

    */

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
