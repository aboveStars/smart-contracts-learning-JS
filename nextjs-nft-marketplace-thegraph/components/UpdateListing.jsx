import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"

import basicNftabi from "../constants/basicNftabi.json"
import marketAbi from "../constants/marketAbi.json"

import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketPlaceAddress,
    onClose,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const dispatch = useNotification()
    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing updated - please refresh",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: marketAbi,
        contractAddress: marketPlaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(
                priceToUpdateListingWith.toString()
            ),
        },
    })

    const updateListingFunctionCaller = async () => {
        await updateListing({
            onError: (error) => console.log(error),
            onSuccess: (results) => handleUpdateListingSuccess(results),
        })
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={updateListingFunctionCaller}
        >
            <Input
                label="Update Listing price in L1 Curreny (ETH)"
                name="New Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}
