const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("BasicNft", async function() {
    let basicNft
    let deployer
    beforeEach(async function() {
        /** Contract Deploying... */
        const namedAcounts = await getNamedAccounts()
        deployer = namedAcounts.deployer

        await deployments.fixture(["all"])
        basicNft = await ethers.getContract("BasicNFT")
    })

    it("Token Count is zero when deployed", async function() {
        const startingTokenCounter = await basicNft.getTokenCount()
        assert.equal(startingTokenCounter.toString(), "0")
    })

    it("Minting NFT is working", async function() {
        await basicNft.mintNft()
        const newTokenCount = await basicNft.getTokenCount()
        assert.equal(newTokenCount.toString(), "1")

        await basicNft.mintNft()
        const newerTokenCount = await basicNft.getTokenCount()
        assert.equal(newerTokenCount.toString(), "2")
    })
})
