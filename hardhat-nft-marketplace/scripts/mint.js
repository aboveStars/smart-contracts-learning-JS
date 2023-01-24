const { ethers, network } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

const { moveBlocks } = require("../utils/move-blocks")

async function mint() {
    const basicNft = await ethers.getContract("BasicNFT")
    console.log("Minting.....")

    const mintTx = await basicNft.mintNft()
    const rTx = await mintTx.wait(1)

    const tokenId = await rTx.events[0].args.tokenId
    console.log(tokenId.toString())
    console.log(basicNft.address.toString())

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
