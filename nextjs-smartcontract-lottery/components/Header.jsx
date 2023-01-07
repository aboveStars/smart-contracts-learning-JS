import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div>
            <big>Decentralized Lottery</big>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
