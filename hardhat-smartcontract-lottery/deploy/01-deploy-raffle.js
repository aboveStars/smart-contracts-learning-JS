const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-harhdat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Address, subscriptionId
    if (developmentChains.includes(network.name)) {
        log("We are local.... We configuring VRF things.....")

        log("getting mock....")
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        log("getting mock address")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        log("creating subscription...")
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        log("confirming...")
        const transactionReceipt = await transactionResponse.wait(1)
        log("confirm done")

        log("getting needed event for subId")
        subscriptionId = transactionReceipt.events[0].args.subId
        log("subId is done")
        log("Funding to sub")
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
        log("Funding for sub done")
        log("VRF things are done")
        log("---------------------------------")
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2Address"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [
        vrfCoordinatorV2Address, // vrf
        entranceFee, // lottery
        gasLane, // vrf
        subscriptionId, // vrf
        callbackGasLimit, // vrf
        interval, // lottery
    ]
    log("We are about to deploy Raffle.....")
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Raffle Deploying completed.")
    log("--------------------------------------")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
}

module.exports.tags = ["all", "raffle"]
