const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const {
    developmentChains,
    networkConfig,
} = require("../helper-hardhat-config.js")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    let addressOfAggregatorV3

    if (developmentChains.includes(network.name)) {
        addressOfAggregatorV3 = (await ethers.getContract("MockV3Aggregator"))
            .address
    } else {
        addressOfAggregatorV3 =
            networkConfig[network.config.chainId].ethUsdPriceFeedAddress
    }

    const lowSVG = fs.readFileSync("./images/dynamicNft/frown.svg", {
        encoding: "utf-8",
    })

    const highSVG = fs.readFileSync("./images/dynamicNft/happy.svg", {
        encoding: "utf-8",
    })

    args = [addressOfAggregatorV3, lowSVG, highSVG]

    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name)) {
        await verify(dynamicSvgNft.address, args)
    }
}

module.exports.tags = ["all", "dynamic", "main"]
