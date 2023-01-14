const { ethers, network } = require("hardhat")

async function main() {
    const rI = await ethers.getContract("RandomIpfsNft")
    const fee = (await rI.getMintFee()).toString()
    console.log("Fee: " + fee)
    try {
        const tx = await rI.requestNft({ value: fee })
        txR = tx.wait(1)
        console.log(txR)
    } catch (error) {
        console.error(error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
