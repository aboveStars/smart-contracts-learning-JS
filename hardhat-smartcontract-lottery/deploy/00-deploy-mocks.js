const { network } = require("hardhat")
const { developmentChains } = require("../helper-harhdat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 Link Per Request...
const GAS_PRICE_LINK = 1e9

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("We are in local... Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true,
            waitConfirmations: 1,
        })
        log("Mock Deployed....")
        log("-------------------------------")
    } else {
        log("We are on real chain...")
        log("...We don't deploy mocks ")
        log("-------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
