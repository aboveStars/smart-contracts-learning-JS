// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SafeMathTester {
    /*
    Unchecked is for not use SAFE_MATH
    THIS Reduces gas usage.
    */
    uint8 public bigNumber = 255; // unchecked

    function add() public {
        unchecked {
            bigNumber += 1;
        }
    }
}
