const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 Link Per Request...
const GAS_PRICE_LINK = 1e9

const DECIMALS = 18
const INITIAL_PRICE = ethers.utils.parseUnits("2000", "ether")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("We are in local... Deploying mocks...")
        log("-------------------")
        log("Deploying VRFCoordinator......")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true,
            waitConfirmations: 1,
        })
        log("VRFCoordinator Mock Deployed....")
        log("-------------------")
        await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS, INITIAL_PRICE],
            log: true,
            waitConfirmations: 1,
        })
    } else {
        log("We are on real chain...")
        log("...We don't deploy any mocks ")
        log("-------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
