import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"

const inter = Inter({ subsets: ["latin"] })

const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const marketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const seller = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"

import basicNftabi from "../constants/basicNftabi.json"
import marketAbi from "../constants/marketAbi.json"

export default function Home() {
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    async function approveAndList(data) {
        console.log("Approving....")

        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils
            .parseUnits(data.data[2].inputResult, "ether")
            .toString()

        console.log(`Nft Address: ${nftAddress}`)
        console.log(`Token Id: ${tokenId}`)
        console.log(`Price: ${price}`)

        const approveOptions = {
            abi: basicNftabi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: (results) => handleApproveSuccess(results),
            onError: (error) => {
                console.error(error)
            },
        })

        async function handleApproveSuccess(tx) {
            await tx.wait(1)
            console.log("Time to List")

            const listOptions = {
                abi: marketAbi,
                contractAddress: marketAddress,
                functionName: "listItem",
                params: {
                    nftAddress: nftAddress,
                    tokenId: tokenId,
                    price: price,
                },
            }

            await runContractFunction({
                params: listOptions,
                onSuccess: (results) => listSuccessHandler(results),
                onError: (error) => {
                    console.error(error)
                },
            })
        }

        async function listSuccessHandler(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Successfully Listed",
                title: "NFT Listed",
                position: "topR",
            })
        }
    }
    return (
        <div>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },

                    {
                        name: "Token Id",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "tokenId",
                    },

                    {
                        name: "Price",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell Your Nft"
                id="mainForm"
            ></Form>
        </div>
    )
}
