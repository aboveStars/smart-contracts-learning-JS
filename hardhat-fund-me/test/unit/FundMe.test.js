const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1 eth...

    beforeEach(async function () {
        // const accounts = await ethers.getSigners();
        // const account = accounts[0]

        deployerResponse = await getNamedAccounts()
        deployer = deployerResponse.deployer

        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer) // most recent contract...

        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you dont send enough ETH...", async function () {
            await expect(fundMe.fund()).to.be.revertedWith("FUND MORE BABE")
        })
        it("updates the amounted data structure...", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)

            assert.equal(response.toString(), sendValue.toString())
        })
    })
})
