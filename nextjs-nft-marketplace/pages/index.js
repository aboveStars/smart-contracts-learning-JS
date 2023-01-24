import NFTBox from "@/components/NFTBox"

const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const marketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const seller = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"

import basicNftabi from "../constants/basicNftabi.json"
import marketAbi from "../constants/marketAbi.json"

import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"

export default function Home() {
    const [price, setPrice] = useState("0")

    const { isWeb3Enabled } = useMoralis()

    const { runContractFunction: getListing } = useWeb3Contract({
        abi: marketAbi,
        contractAddress: marketAddress,
        functionName: "getListing",
        params: {
            nftAddress: nftAddress,
            tokenId: "5",
        },
    })

    const priceGetter = async () => {
        const tx = await getListing()
        console.log(tx.price.toString())
        setPrice(tx.price.toString())
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            priceGetter()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            {isWeb3Enabled && price > 0 ? (
                <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId="0"
                    marketPlaceAddress={marketAddress}
                    seller={seller}
                    key={`${nftAddress}$0`}
                ></NFTBox>
            ) : (
                console.log("Web3 Not Enabled")
            )}
        </div>
    )
}
