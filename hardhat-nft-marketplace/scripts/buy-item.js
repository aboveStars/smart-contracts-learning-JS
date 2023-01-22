const { ethers, network } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

const { moveBlocks } = require("../utils/move-blocks")

async function buy() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNFT")

    const response = await nftMarketPlace.getListing(basicNft.address, 0)
    const price = response.price
    console.log("Price: " + price.toString())

    tx = await nftMarketPlace.buyItem(basicNft.address, 0, { value: price })
    rTx = await tx.wait(1)

    console.log("Bought successfully")

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
