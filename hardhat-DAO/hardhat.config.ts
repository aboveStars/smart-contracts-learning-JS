import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/types"

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//     defaultNetwork: "hardhat",
//     networks: {
//         localhost: {
//             url: "http://127.0.0.1:8545/",
//             chainId: 31337,
//             // acounts: HARDHAT automatically...
//         },
//     },
//     solidity: {
//         compilers: [
//             { version: "0.8.8" },
//             { version: "0.6.6" },
//             { version: "0.8.9" },
//         ],
//     },

//     namedAccounts: {
//         deployer: {
//             default: 0,
//         },
//         user: {
//             default: 1,
//         },
//     },
//     mocha: {
//         timeout: 1000000, // 1000,000 (seconds) ..... 1 second = 1000
//     },
// }

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
    },
    solidity: "0.8.9",
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}

export default config
