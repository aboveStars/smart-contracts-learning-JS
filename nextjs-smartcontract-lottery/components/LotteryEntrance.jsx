import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: hexChainId, isWeb3Enabled } = useMoralis() // chainId == hex value
    const chainId = parseInt(hexChainId)
    let raffleAddress

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    if (chainId in contractAddresses) {
        raffleAddress = contractAddresses[chainId][0]
        console.log("Raffle Address: " + raffleAddress)
        console.log("ChainId: " + chainId)
    } else {
        raffleAddress = null
    }

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getPlayersLength } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getPlayersLength",
        params: {},
    })

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    async function getValuesFromContract() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeFromCall)

        const playersLengthFromContract = (await getPlayersLength()).toString()
        setNumPlayers(playersLengthFromContract)

        const recentWinnerFromContract = (await getRecentWinner()).toString()
        setRecentWinner(recentWinnerFromContract)
    }

    useEffect(() => {
        console.log(`web3enabled: ${isWeb3Enabled}`)
        if (isWeb3Enabled) {
            getValuesFromContract()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        handleNewNotification("warning", "Waiting for Confirmations")
        await tx.wait(1)
        handleNewNotification("success", "Succeefully Mined!")
        getValuesFromContract()
    }

    const handleNewNotification = function (_type, _message) {
        dispatch({
            type: _type,
            message: _message,
            title: "Transaction Status",
            position: "topR",
        })
    }

    return (
        <div className="p-5">
            Hi From Lottery Entrance
            <div>
                {raffleAddress ? (
                    <div>
                        <div>
                            {" "}
                            Fee:{ethers.utils.formatUnits(entranceFee, "ether")}
                        </div>
                        <div>ETH Number of Players: {numPlayers}</div>
                        <div>Recent Winner: {recentWinner}</div>
                        <div>
                            <button
                                className="bg-orange-600 text-white font-bold ml-auto px-4 py-4 rounded-xl"
                                onClick={async function () {
                                    await enterRaffle({
                                        onSuccess: handleSuccess,
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                disabled={isLoading || isFetching}
                            >
                                Enter Raffle
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>No Raffle Address Found in this network</div>
                )}
            </div>
        </div>
    )
}
