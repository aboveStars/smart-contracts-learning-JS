const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config.js")

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

async function main() {
    const { deployer } = await getNamedAccounts()

    // basic nft
    const basicNft = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(
        "Basic NFT index 0 has tokenURI: " +
            (await basicNft.tokenURI(0)).toString()
    )

    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000)
        randomIpfsNft.once("NftMinted", async function () {
            resolve()
        })

        const randomIpfsMintNftTx = await randomIpfsNft.requestNft({
            value: mintFee.toString(),
        })
        const txR = await randomIpfsMintNftTx.wait(1)

        if (developmentChains.includes(network.name)) {
            const vrfCoordinator = await ethers.getContract(
                "VRFCoordinatorV2Mock"
            )
            await vrfCoordinator.fulfillRandomWords(
                txR.events[1].args.requestId,
                randomIpfsNft.address
            )
        }
    })

    console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
    )

    // Dynamic

    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)

    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue)
    await dynamicSvgNftMintTx.wait(1)
    console.log(
        `Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)} `
    )
}
