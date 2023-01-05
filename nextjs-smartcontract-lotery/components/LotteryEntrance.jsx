import { useWeb3Contract } from "react-moralis"

export default function LotteryEntrance() {
    const { runContractFunction: enterRffle } = useWeb3Contract({
        abi: "",
        contractAddress: "",
        functionName: "",
        params: {},
        msgValue: "",
    })

    return <div>Hi From Lottery Entrance</div>
}
