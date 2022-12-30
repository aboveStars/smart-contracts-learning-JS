/* This script is for: Interacting with contract
    * It has no 'deploy' exclusive plugin. (We are already not deploying but I want to be noticed.)
        So we dont have HRE object, we should take 'getNamedAccounts' from direcly 'hardhat'
 */

const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    // Getting contract...
    const { deployer } = await getNamedAccounts() // deployer --> default --> 'default' defines who call function.
    const fundMe = await ethers.getContract("FundMe", deployer) // getting contract with wanted signer (in this, us.)
    console.log("Getting contract")

    // calling function...
    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    })

    // verify
    await transactionResponse.wait(1)

    // final
    console.log("Funded...")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
