const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("Deploying the contract....")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    // rpc ?, private_key...? ---> automatically takes from hardhat network (dev)
    console.log(`Deployed contract to ${simpleStorage.address}`)

    // avoid local network to verify ----> 31337(ID for dev) ---- 5(for goerli)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting confirmations...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    // get old value
    const currentValue = await simpleStorage.retrieveView()
    console.log(`Current value is: ${currentValue}`)

    // update current value
    const transactionResponse = await simpleStorage.store(53)
    await transactionResponse.wait(1)

    // get new value
    const updatedValue = await simpleStorage.retrieveView()
    console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    // args for constructor...
    console.log("Verifying contract....")
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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
