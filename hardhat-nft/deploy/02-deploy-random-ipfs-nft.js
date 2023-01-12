const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeImages } = require("../utils/uploadToPinata")
const imagesLocation = "./images/randomNft"

module.exports = async ({ getNamedAccounts, deployments }) => {
    // const { deploy, log, get } = deployments
    // const { deployer } = await getNamedAccounts()
    // let tokenUris
    // if (process.env.UPLOAD_TO_PINATA) {
    //     tokenUris = await handleTokenUris()
    // }
    // let vrfCoordinatorV2Address, subId
    // const randomIpfsNft = await deploy("RandomIpfsNft", {
    //     from: deployer,
    //     args: args,
    //     log: true,
    //     waitConfirmations: network.config.blockConfirmations || 1,
    // })
    // if (!developmentChains.includes(network.name)) {
    //     await verify(randomIpfsNft.address, [])
    //     const vrfCoordinatorV2Mock = await ethers.getContract(
    //         "VRFCoordinatorV2Mock"
    //     )
    //     vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    //     const tx = await vrfCoordinatorV2Mock.createSubscription()
    //     const txR = txR.wait(1)
    //     const subId = await txR.events[0].args.subId
    //     await vrfCoordinatorV2Mock.addConsumer(subId, randomIpfsNft.address)
    // } else {
    //     vrfCoordinatorV2Address =
    //         networkConfig[network.config.chainId]["vrfCoordinatorV2Address"]
    //     subId = networkConfig[network.config.chainId]["subscriptionId"]
    // }
    // const args = [
    //     vrfCoordinatorV2Address,
    //     subId,
    //     networkConfig[network.config.chainId]["gasLane"],
    //     networkConfig[network.config.chainId].callbackGasLimit,
    //     "",
    //     ethers.utils.parseEther(networkConfig[network.config.chainId].mintFee),
    // ]

    await storeImages(imagesLocation)
}

module.exports.tags = ["all", "randomIpfs", "main"]
