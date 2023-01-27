// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// IMPLEMENTATION (LOGIC) CONTRACT

contract Box {
    uint256 internal value;

    event ValueChanged(uint256 indexed newValue);

    function store(uint256 newValue) public {
        value = newValue;
    }

    function retrieve() public view returns (uint256) {
        return value;
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}
