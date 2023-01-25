import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis, useWeb3Transfer } from "react-moralis"

import basicNftabi from "../constants/basicNftabi.json"
import marketAbi from "../constants/marketAbi.json"

import Image from "next/image"
import { Card } from "web3uikit"

import { ethers } from "ethers"

import UpdateListingModal from "./UpdateListing"

import { useNotification } from "web3uikit"

const marketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const truncateStr = (fullstr, strLen) => {
    if (fullstr.length <= strLen) return fullstr

    const seperator = "..."
    const seperatorLength = seperator.length

    const charsToShow = strLen - seperatorLength

    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)

    return (
        fullstr.substring(0, frontChars) +
        seperator +
        fullstr.substring(fullstr.length - backChars)
    )
}

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketPlaceAddress,
    seller,
}) {
    const { isWeb3Enabled, account } = useMoralis()

    const [imageUri, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftabi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: marketAbi,
        contractAddress: marketAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        // get Token Uri
        const tokenUri = await getTokenURI()
        console.log(tokenUri.toString())
        // get the image....
        if (tokenUri) {
            const requestURL = tokenUri.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            const tokenURIResponse = await (await fetch(requestURL)).json()
            console.log(tokenURIResponse)

            const imageURI = tokenURIResponse.image
            const imageURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            setImageURI(imageURL)
            console.log(imageURL)

            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser
        ? "You"
        : truncateStr(seller || "", 15)

    const handleCardClicked = () => {
        isOwnedByUser ? setShowModal(true) : buyer()
    }

    const buyer = async () => {
        await buyItem({
            onError: (error) => console.log(error),
            onSuccess: (results) => handleBuyItemSuccess(results),
        })
    }

    const dispatch = useNotification()
    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item Bought Successfully",
            title: "Item Bought",
            position: "topR",
        })
        console.log("here3")
    }

    const hideModal = () => {
        setShowModal(false)
    }

    return (
        <div>
            <div>
                {imageUri ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            nftAddress={nftAddress}
                            tokenId={5}
                            marketPlaceAddress={marketAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClicked}
                        >
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">
                                    Owned by {formattedSellerAddress}
                                </div>
                                <Image
                                    loader={() => imageUri}
                                    src={imageUri}
                                    height="200"
                                    width="200"
                                ></Image>
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(
                                        price.toString() || "0",
                                        "ether"
                                    )}{" "}
                                    ETH
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div> loading </div>
                )}
            </div>
        </div>
    )
}
