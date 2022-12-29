// SPDX-License-Identifier: MIT
// pragma
pragma solidity ^0.8.0;
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
    address[] public s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;

    // Modifiers...
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @notice To fund...
     * @dev Uses library.
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= FEE,
            "FUND MORE BABE"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withDraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex <= s_funders.length - 1;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        // mappings CANT be in memory... (for s_addressToAmountFunded)

        for (
            uint256 funderIndex = 0;
            funderIndex <= funders.length - 1;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
