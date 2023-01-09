const { run, ethers } = require("hardhat")

async function main() {
    const contractAddress = "0xcD9cC20F526713b6eF95aAD853E076e7f4d4965E"
    const initialSupply = ethers.utils.parseUnits("53", "ether");
    const args = [initialSupply]
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
            contract: "contracts/RizeToken.sol:RizeToken",
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
