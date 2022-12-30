const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

/* When use "yarn hardhat deploy", we should use bottom structure.
    * "getNamedAccounts and deployments" automatically are given by "deploy" command. THEY ARE HRE (hardhat..enviroment)
        * "getNamedAccounts" : it is used to retrieve accounts manually from the attribute namedAccounts ...
            ... defined whithin HARDHAT.CONFIG.JS ...
            ... and it is an exclusive feature with the plugin HARDHAT-DEPLOY.
        * "deployments" : it is used for retrieving "DEPLOY" and "LOG" FUNCTIONS and "GET". HRE.
            * GET : it used for taking "deployed contracts from pool"
 */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    // when we use goerli this is transforms with our privateKey.(hardhat-config)
    // So HRE is not just giving local accounts, more it gives us real account we give it in HARDHAT-CONFIG.

    // Stuff is bottom for: using right Aggregator address (mock or normal)

    // We are in local so we should take Aggregator address from Aggreagtor Contract we deployed.
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        // We are in real network so we should take Aggregator address from chainlink. (we stored it in networkConfig)
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // this is deployed Aggregator by chainlink...
    }

    // basically this is all stuff for deploying...
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("All contracts deployed")

    /* Verifing
     * 'verify' needs etherscanAPI in HARDHAT-CONFIG
     *  Also, 'verify' not comes with hre. It comes from UTILS.
     *  We can only verify, if we are in real network.
     */
    if (!developmentChains.includes(network.name)) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

// this tiny array is for: "deploy --tags" so we deploy what we want not all or 'all' :)
module.exports.tags = ["all", "fundMe"]
