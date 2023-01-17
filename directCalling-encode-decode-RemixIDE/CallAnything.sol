// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CallAnything {
    address public s_someAdress;
    uint256 public s_amount;

    function transfer(address someAddress, uint256 amount) public {
        s_someAdress = someAddress;
        s_amount = amount;
    }

    function getSelectorOne() public pure returns (bytes4 selector) {
        selector = bytes4(keccak256("transfer(address,uint256)"));
    }

    function getDataToCallTransfer(
        address someAddress,
        uint256 amount
    ) public pure returns (bytes memory) {
        return abi.encodeWithSelector(getSelectorOne(), someAddress, amount);
    }

    function callTransferFuntionDirectly(
        address someAddress,
        uint256 amount
    ) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = address(this).call(
            getDataToCallTransfer(someAddress, amount)
        );
        return (bytes4(returnData), success);
    }

    function callTransferFuntionDirectlySignature(
        address someAddress,
        uint256 amount
    ) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSignature(
                "transfer(address,uint256)",
                someAddress,
                amount
            )
        );
        return (bytes4(returnData), success);
    }
}
