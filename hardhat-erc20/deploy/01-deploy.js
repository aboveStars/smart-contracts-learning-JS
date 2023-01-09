const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const initialSupply = ethers.utils.parseUnits("53", "ether");
    const args = [initialSupply]

    log("RizeToken is being deployed.....")
    const rizeToken = await deploy("RizeToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("RizeToken deployed successfully.....")
    await verify(rizeToken.address, args)
}