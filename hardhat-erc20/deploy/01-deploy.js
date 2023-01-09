const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()


    initialSupply = ethers.utils.parseUnits("53", "ether");
    args = [initialSupply]

    log("RizeToken is being deployed.....")
    const rizeTokenV2 = await deploy("RizeTokenV2", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("RizeTokenV2 deployed successfully.....")

    log("Verifying.......")
    verify(rizeTokenV2.address, args)
    log("Verified Successfully!")
}