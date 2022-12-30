const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

/* When use "yarn hardhat deploy", we should use bottom structure.
    * "getNamedAccounts and deployments" automatically are given by "deploy" command.
        * "getNamedAccounts" : it is used to retrieve accounts manually from the attribute namedAccounts ...
            ... defined whithin HARDHAT.CONFIG.JS ...
            ... and it is an exclusive feature with the plugin HARDHAT-DEPLOY.
        * "deployments" : it is used for retrieving "DEPLOY" and "LOG" FUNCTIONS.
 */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name

    if (developmentChains.includes(chainName)) {
        log("Local Network detected. Deploying mocks....")
        // basically all deploy thing is here...
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        //...
        log("Mocks deployed!")
        log("-------------------")
    }
}

module.exports.tags = ["all", "mocks"]
