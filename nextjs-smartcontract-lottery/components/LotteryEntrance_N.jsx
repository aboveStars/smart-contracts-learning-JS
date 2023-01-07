// import { useWeb3Contract } from "react-moralis"
// import { abi, contractAddresses } from "../constants"
// import { useMoralis } from "react-moralis"
// import { useEffect, useState } from "react"

// export default function LotteryEntrance() {
//     const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //pull out chainId obj and rename it as chainIdHex
//     const chainId = parseInt(chainIdHex) //create new var called chainId
//     const raffleAddress =
//         chainId in contractAddresses ? contractAddresses[chainId][0] : null

//     const [entranceFee, setEntranceFee] = useState("0")

//     // const { runContractFunction: enterRaffle } = useWe3Contract({
//     //     abi: abi,
//     //     contractAddress: raffleAddress,
//     //     functionName: "enterRaffle",
//     //     params: {},
//     //     msgValue:
//     // })

//     const { runContractFunction: getEntranceFee } = useWeb3Contract({
//         abi: abi,
//         contractAddress: raffleAddress,
//         functionName: "getEntranceFee",
//         params: {},
//     })

//     useEffect(() => {
//         if (isWeb3Enabled) {
//             async function updateUI() {
//                 const entranceFeeFromCall = (await getEntranceFee()).toString()
//                 setEntranceFee(entranceFeeFromCall)
//                 console.log(entranceFee)
//             }
//             updateUI()
//         }
//     }, [isWeb3Enabled])

//     msgValue: return (
//         <div>
//             Hi from lottery entrance<div>{entranceFee}</div>
//         </div>
//     )
// }
