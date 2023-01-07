const { ethers, network } = require("hardhat")


async function main() {

    const raffle = await ethers.getContract("Raffle")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

    const subId = await raffle.getSubscriptionId()
    await vrfCoordinatorV2Mock.addConsumer(subId, raffle.address)

    const tx = await raffle.performUpkeep([])
    const txR = await tx.wait(1)

    await vrfCoordinatorV2Mock.fulfillRandomWords(
        txR.events[1].args.requestId,
        raffle.address
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

