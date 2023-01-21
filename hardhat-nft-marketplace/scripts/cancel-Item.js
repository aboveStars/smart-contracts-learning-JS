const { ethers, network } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

const { moveBlocks } = require("../utils/move-blocks")

async function mintAndList() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNFT")

    tx = await nftMarketPlace.cancelListing(basicNft.address, 0)
    rTx = await tx.wait(1)

    console.log("Cancelled successfully")

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
