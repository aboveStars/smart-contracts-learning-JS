const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("randomIpfsNftTest", function () {
    let vrfCoordinator, randomIpfsNftContract, signer
    beforeEach(async function () {
        signer = (await getNamedAccounts()).deployer
        randomIpfsNftContract = await ethers.getContract(
            "RandomIpfsNft",
            signer
        )
    })

    describe("All Stating", function () {
        it("Fullfill test", async function () {
            await new Promise(async (resolve, reject) => {
                randomIpfsNftContract.once("NftMinted", async function () {
                    if (true) {
                        resolve()
                    } else {
                        reject()
                    }
                })

                const fee = (
                    await randomIpfsNftContract.getMintFee()
                ).toString()

                await randomIpfsNftContract.requestNft({
                    value: fee,
                })
            })

            console.log("Successfully minted...")
        })
    })
})
