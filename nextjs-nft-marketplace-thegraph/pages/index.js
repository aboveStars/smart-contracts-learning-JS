import NFTBox from "@/components/NFTBox"

import { useMoralis } from "react-moralis"

import networkMapping from "../constants/networkMapping"
import { useQuery } from "@apollo/client"

import GET_ACTIVE_ITEMS from "@/constants/subgraphQueries"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    if (!chainId) {
        return (
            <div>
                <h1>Fetching ChainId</h1>
                {console.log("CHAIN ID IS BEING FETCHED")}
            </div>
        )
    }

    const chainString = parseInt(chainId).toString()
    console.log(chainString)

    const marketPlaceAddress = networkMapping[chainString].NftMarketPlace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div>
            {isWeb3Enabled ? (
                loading || !listedNfts ? (
                    <div>Loading...</div>
                ) : (
                    listedNfts.activeItems.map((nft) => {
                        console.log(nft)
                        const { price, nftAddress, tokenId, seller } = nft

                        return (
                            <div>
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketPlaceAddress={marketPlaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            </div>
                        )
                    })
                )
            ) : (
                console.log("Web3 Not Enabled")
            )}
        </div>
    )
}
