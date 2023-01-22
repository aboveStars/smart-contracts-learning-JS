import NFTBox from "@/components/NFTBox"

const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const marketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const seller = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"

export default function Home() {
    return (
        <div>
            <NFTBox
                price="53"
                nftAddress={nftAddress}
                tokenId="0"
                marketPlaceAddress={marketAddress}
                seller={seller}
                key={`${nftAddress}$0`}
            ></NFTBox>
        </div>
    )
}
