import "@/styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "@/components/Header"
import { NotificationProvider } from "web3uikit"
import Head from "next/head"

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/41318/nft-market-place-graph/v.0.0.3",
})

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Nft Market Place</title>
                <meta name="description" content="One Place for All!" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}
