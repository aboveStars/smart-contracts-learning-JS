import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: hexChainId, isWeb3Enabled } = useMoralis() // chainId == hex value
    const chainId = parseInt(hexChainId)
    let raffleAddress

    const [entranceFee, setEntranceFee] = useState("0")

    if (chainId in contractAddresses) {
        raffleAddress = contractAddresses[chainId][0]
        console.log("Raffle Address: " + raffleAddress)
        console.log("ChainId: " + chainId)
    } else {
        raffleAddress = null
    }

    // const { runContractFunction: enterRaffle } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress,
    //     functionName: "enterRaffle",
    //     params: {},
    //     //msgValue:
    // })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    async function getEntranceAsync() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeFromCall)
    }

    useEffect(() => {
        console.log(`web3enabled: ${isWeb3Enabled}`)
        if (isWeb3Enabled) {
            getEntranceAsync()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            Hi From Lottery Entrance
            <div>
                Entrance Fee is:{" "}
                {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </div>
        </div>
    )
}
