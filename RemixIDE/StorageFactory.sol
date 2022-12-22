// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory {
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage a_simpleStorage = new SimpleStorage();
        simpleStorageArray.push(a_simpleStorage);
    }

    // we are on 3:16:48
}
