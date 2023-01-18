const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNFT")
    console.log("Minting.....")

    const mintTx = await basicNft.mintNft()
    const rTx = await mintTx.wait(1)
    const tokenId = await rTx.events[0].args.tokenId
    console.log("Approving nft....")

    const approvalTx = await basicNft.approve(nftMarketPlace.address, tokenId)
    await approvalTx.wait(1)

    console.log("Listing nft....")

    const tx = await nftMarketPlace.listItem(basicNft.address, tokenId, PRICE)
    await tx.wait(1)
    console.log("Listed.")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
