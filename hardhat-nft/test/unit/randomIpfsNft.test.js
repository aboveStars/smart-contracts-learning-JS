const { deployments, ethers, getNamedAccounts } = require("hardhat")
const {
    isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

describe("randomIpfsNftTest", function () {
    let vrfCoordinator, randomIpfsNftContract, signer
    beforeEach(async function () {
        signer = (await getNamedAccounts()).deployer

        await deployments.fixture(["randomIpfs", "mocks"])

        vrfCoordinator = await ethers.getContract(
            "VRFCoordinatorV2Mock",
            signer
        )
        randomIpfsNftContract = await ethers.getContract(
            "RandomIpfsNft",
            signer
        )
    })

    describe("All Unit", function () {
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

                const tx = await randomIpfsNftContract.requestNft({
                    value: fee,
                })
                const txR = await tx.wait(1)

                await vrfCoordinator.fulfillRandomWords(
                    txR.events[1].args.requestId,
                    randomIpfsNftContract.address
                )
            })

            console.log("Successfully minted...")
        })
    })
})
