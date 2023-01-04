const { run } = require("hardhat")

async function verify(contractAddress, args) {
    // args for constructor...
    console.log("Verify process has been started.")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
    
}
module.exports = { verify }
