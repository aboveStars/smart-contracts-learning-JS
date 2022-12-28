// function deployFunc() {
//     console.log("Hi!")
// }
// module.exports.default = deployFunc

const { network } = require("hardhat")

// module.exports =  async(hre) => {
//     const {getNamedAccounts,deployments} = hre
//     // hre.getName..., hre.deploy....
// }

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// SAME WITH ABOVE
// const helper = require("../helper-hardhat-config");
// const networkConfig = helper.networkConfig;

const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    // when changing chain ...
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // when going for localhost use mocks....
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address...
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("-------------------------")
    log("All contracts deployed")
    log("-------------------------")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundMe"]
