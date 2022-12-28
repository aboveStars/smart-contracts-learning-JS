// SPDX-License-Identifier: MIT
// pragma
pragma solidity 0.8.8;
// imports
import "./PriceConverter.sol";

error FundMe__NotOwner();

// interfaces...

/** @title Contract for funding
 * @author aboveStars
 * @notice It is just a demo
 * @dev Contract uses library.
 */

contract FundMe {
    // Type Declarations...
    using PriceConverter for uint256;

    // State Variables
    uint256 public constant FEE = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    // Modifiers...
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @notice To fund...
     * @dev Uses library.
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= FEE,
            "FUND MORE BABE"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withDraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex <= funders.length - 1;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }
}
