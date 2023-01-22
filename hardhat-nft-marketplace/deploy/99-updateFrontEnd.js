const { ethers, network } = require("hardhat")

const frontnedContractsFile =
    "../nextjs-nft-marketplace/constants/networkMapping.json"

const basicNftAbiFile = "../nextjs-nft-marketplace/constants/basicNftabi.json"
const marketAbiFile = "../nextjs-nft-marketplace/constants/marketAbi.json"

const fs = require("fs")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END == "true") {
        console.log("updating front end....")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const chainId = network.config.chainId.toString()

    const contractAddresses = JSON.parse(
        fs.readFileSync(frontnedContractsFile, "utf-8")
    )

    if (chainId in contractAddresses) {
        if (
            !contractAddresses[chainId]["NftMarketPlace"].includes(
                nftMarketPlace.address
            )
        ) {
            contractAddresses[chainId]["NftMarketPlace"].push(
                nftMarketPlace.address
            )
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketPlace: [nftMarketPlace.address],
        }
    }

    fs.writeFileSync(frontnedContractsFile, JSON.stringify(contractAddresses))
}

async function updateAbi() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    fs.writeFileSync(
        marketAbiFile,
        nftMarketPlace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNFT")
    fs.writeFileSync(
        basicNftAbiFile,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

module.exports.tags = ["all", "frontend"]
