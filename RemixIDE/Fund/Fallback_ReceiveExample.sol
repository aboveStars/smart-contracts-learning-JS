// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FallBackExample {
    uint256 public result;

    /*

    Receive() stands for BLANK transactions.
    fallback() stands for data filled tx but NOT APPROPRITE

    IF a blank data comes and there is no reveive(), fallback should be there to action...

    */
    receive() external payable {
        result += 1;
    }

    fallback() external payable {
        result = 2;
    }
}
