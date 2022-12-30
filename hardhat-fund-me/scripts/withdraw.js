const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    // Getting Contract
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Getting Contract...")

    // calling function
    const transactionResponse = await fundMe.withDraw()
    await transactionResponse.wait(1)
    console.log("Verifing...")

    // final
    console.log("withdrawed...")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
