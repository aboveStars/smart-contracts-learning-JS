const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { networkConfig } = require("../../helper-harhdat-config")

describe("Interval Test on TestNet", function () {
    let deployer, raffle, fee, timestamp_1, timestamp_2
    beforeEach(async function () {
        console.log("Getting needed values... ")
        try {
            deployer = (await getNamedAccounts()).deployer
            raffle = await ethers.getContract("Raffle", deployer)
            fee = await raffle.getEntranceFee()
            timestamp_1 = await raffle.getLastTimeStamp()
        } catch (error) {
            console.log(error)
        }

        console.log("Done.")
    })

    describe("PLEASE BE SUCCESSFUL", function () {
        it("Interval Testing on its way....", async function () {
            await new Promise(async (resolve, reject) => {
                raffle.once("WinnerPicked", async function () {
                    console.log("Done")
                    console.log("We are getting last needed variable....")
                    try {
                        timestamp_2 = await raffle.getLastTimeStamp()
                    } catch (error) {
                        console.log(error)
                    }
                    console.log("Done.")

                    console.log("We are starting to assertion test...")

                    try {
                        assert(
                            timestamp_2.sub(timestamp_1) >=
                                Number(networkConfig[network.config.chainId]["interval"])
                        )
                        console.log("Test is successful.")
                        resolve()
                    } catch (error) {
                        reject(error)
                    }
                })

                console.log("Entering to raffle...")
                await raffle.enterRaffle({ value: fee })
                console.log("Done")
                console.log("We are waiting for listener(WinnerPickedEvent)...")
            })
        })
    })
})
