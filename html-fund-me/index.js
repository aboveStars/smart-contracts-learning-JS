import { ethers } from "./ethers-v.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const ethAmounter = document.getElementById("ethAmount")
const getBalanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Metamask is avaliable. We will try to connect it...")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected successfully")
        connectButton.innerHTML = "CONNECTED!"
    } else {
        connectButton.innerHTML = "Please Install Metamask!"
    }
}

async function fund() {
    const ethAmount = ethAmounter.value
    console.log(`Funding with ethAmount: ${ethAmount}`)

    if (typeof window.ethereum !== "undefined") {
        // provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // signer
        const signer = provider.getSigner()
        console.log(signer)
        // contract ---> address & abi
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withDraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Withdraw is done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
