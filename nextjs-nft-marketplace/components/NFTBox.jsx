import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"

import basicNftabi from "../constants/basicNftabi.json"
import marketAbi from "../constants/marketAbi.json"

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketPlaceAddress,
    seller,
}) {
    const { isWeb3Enabled } = useMoralis()

    const [imageUri, setImageURI] = useState("")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftabi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        // get Token Uri
        // get the image....
        console.log(basicNftabi)
        const tokenUri = await getTokenURI()
        console.log(tokenUri.toString())
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
}
