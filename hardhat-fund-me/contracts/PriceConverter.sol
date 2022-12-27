// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        (
            uint80 roundID,
            int256 answer,
            uint256 startAt,
            uint256 updateAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return uint256(answer * 1e10); // because price feed gives us with 8 deciamls, we converted it to 18 decimals.
    }

    function getConversionRate(
        uint256 ethAmount
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18; // (ethPrice/1e18)
        return ethAmountInUSD;
    }
}
