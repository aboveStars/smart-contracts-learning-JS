const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const {
    storeImages,
    storeTokenUriMetadata,
} = require("../utils/uploadToPinata")
const { LogDescription } = require("@ethersproject/abi")
const imagesLocation = "./images/randomNft"

const metaDataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_Type: "Cuteness",
            value: 100,
        },
    ],
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log("Getting HRE Varibales....")
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    log("Done.")
    log("--------------")

    log("Token-NFT URI Stuff Process has started....")
    let tokenUris
    if (process.env.UPLOAD_TO_PINATA) {
        tokenUris = await handleTokenUris()
    }
    log("--------------")

    let vrfCoordinatorV2Address, subId, vrfCoordinatorV2Mock

    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txR = await tx.wait(1)

        subId = await txR.events[0].args.subId
    } else {
        vrfCoordinatorV2Address =
            networkConfig[network.config.chainId]["vrfCoordinatorV2Address"]
        subId = networkConfig[network.config.chainId]["subscriptionId"]
    }

    const args = [
        vrfCoordinatorV2Address,
        subId,
        networkConfig[network.config.chainId]["gasLane"],
        networkConfig[network.config.chainId].callbackGasLimit,
        tokenUris,
        ethers.utils.parseEther(networkConfig[network.config.chainId].mintFee),
    ]

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name)) {
        await verify(randomIpfsNft.address, args)
    } else {
        await vrfCoordinatorV2Mock.addConsumer(subId, randomIpfsNft.address)
        console.log("Adding Consumer done.")
    }
}

async function handleTokenUris() {
    tokenUris = []

    console.log("We are firstly uploading images to IPFS NODE on PINATA")
    const { responses: imageUploadResponse, files } = await storeImages(
        imagesLocation
    )
    console.log("Done.")
    console.log("---------")

    console.log("We are preparing to make MetaData for our NFT.....")
    log("--------------")
    for (index in imageUploadResponse) {
        console.log(
            `We are creating metadata for ${files[index].replace(
                ".png",
                ""
            )}.....`
        )

        let tokenUriMetadata = { ...metaDataTemplate }

        tokenUriMetadata.name = files[index].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponse[index].IpfsHash}`

        console.log(
            `Uploading MetaData of ${tokenUriMetadata.name} to IPFS - PINATA.....`
        )
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        )
        console.log("Done.")
        console.log("---------")

        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }

    console.log("Are MetaData URI's:  ")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomIpfs", "main"]
