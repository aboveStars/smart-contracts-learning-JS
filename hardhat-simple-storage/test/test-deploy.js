const { ethers } = require("hardhat")
const {
    isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    // let simpleStorageFactory;
    // let simpleStorage;
    let simpleStorage, simpleStorageFactory

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number 0", async function () {
        const currentValue = await simpleStorage.retrieveView()
        const expectedValue = "0"

        assert.equal(currentValue.toString(), expectedValue)
        // expect(currentValue.toString()).to.equal(expectedValue)
    })
    it("Should update when we call store", async function () {
        const expectedValue = 53
        const transactResponse = await simpleStorage.store(expectedValue)
        await transactResponse.wait(1)

        const currentValue = await simpleStorage.retrieveView()
        assert.equal(currentValue, expectedValue)
    })
})
