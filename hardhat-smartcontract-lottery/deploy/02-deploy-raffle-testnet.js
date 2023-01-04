const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-harhdat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("Needed methods are ready.")
    log("----------------------")

    const chainId = network.config.chainId

    let vrf, entranceFee, gasLane, subId, callBackGasLimit, interval

    vrf = networkConfig[chainId]["vrfCoordinatorV2Address"]
    entranceFee = ethers.utils.parseEther("1")
    gasLane = networkConfig[chainId]["gasLane"]
    subId = networkConfig[chainId]["subscriptionId"]
    callBackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    interval = networkConfig[chainId]["interval"]

    const args = [vrf, entranceFee, gasLane, subId, callBackGasLimit, interval]

    log("Deploying Raffle Contract....")

    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })

    log("Deploying successful")
    log("----------------------")

    log("Verify process in his way....")
    await verify(raffle.address, args)
    log("Verify process has been finished successfully")

    log("----------------------")
    log("Contract Deployment and Verifying operations are SUCCESSFULL.")
    log("We are ready for tests")
    log("----------------------")
}

module.exports.tags = ["testnet.Raffle.Deploy"]
