import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="border-b-2">
            <h1 className="py-5 px-5 text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto- py-1 px-1"></div>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
