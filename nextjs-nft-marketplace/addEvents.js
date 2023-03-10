const Moralis = require("moralis/node")
require("dotenv").config()

const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1137" : chainId

const contractAddress = contractAddresses[chainId]["NftMarketPlace"][0]

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER
const appId = proceess.env.NEXT_PUBLIC_MORALIS_APP_ID
const masterKey = process.env.masterkey

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log("Working with contract address:  " + contractAddress.toString())

    const itemListedOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    }
    const itemBoughtOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemBought(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    }

    const itemCancelledOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCancelled",
            type: "event",
        },
        table: "ItemCancelled",
    }

    const listedResponse = await Moralis.Cloud.run(
        "watchContractEvent",
        itemListedOptions,
        { useMasterKey: true }
    )

    const boughtResponse = await Moralis.Cloud.run(
        "watchContractEvent",
        itemBoughtOptions,
        { useMasterKey: true }
    )

    const cancelledResponse = await Moralis.Cloud.run(
        "watchContractEvent",
        itemCancelledOptions,
        { useMasterKey: true }
    )

    if (
        listedResponse.success &&
        boughtResponse.success &&
        cancelledResponse.success
    ) {
        console.log("Database updated to watch events....")
    } else {
        console.error(
            "Something gone wrong while uppdating database to watch events"
        )
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
