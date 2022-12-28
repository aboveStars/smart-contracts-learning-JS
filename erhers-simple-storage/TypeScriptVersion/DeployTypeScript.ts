import {ethers} from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
   // CreatingContract...
   const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

   //   const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
   //   let wallet = new ethers.Wallet.fromEncryptedJsonSync(
   //     encryptedJson,
   //     process.env.PRIVATE_KEY_PASSWORD
   //   );

   //   wallet = await wallet.connect(provider);

   const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
   const binary = fs.readFileSync(
      "./SimpleStorage_sol_SimpleStorage.bin",
      "utf8"
   )

   // Deploying
   const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
   console.log("Deploying please wait...")
   const contract = await contractFactory.deploy()
   await contract.deployTransaction.wait(1)
   console.log(`Contract address: ${contract.address}`)

   // get number
   const currentFavoriteNumber = await contract.retrieveView()
   console.log(`Favorite Current: ${currentFavoriteNumber.toString()}`)
   // store
   const txResponse = await contract.store("53")
   await txResponse.wait(1)
   // again get number
   const updatedFavorite = await contract.retrieveView()
   console.log(`New number we love is: ${updatedFavorite}`)

   //   console.log("Lets deploy with only tx data");
   //   const nonce = await wallet.getTransactionCount();
   //   const tx = {
   //     nonce: nonce,
   //     gasPrice: 2000000,
   //     gasLimit: 1000000,
   //     to: null,
   //     value: 0,
   //     data: "0x608060405260016000806101000a81548160ff021916908315150217905550603560015560356002557fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcb6003556040518060400160405280600a81526020017f6669667479746872656500000000000000000000000000000000000000000000815250600490805190602001906200009992919062000218565b5073ae8dc4c95ccc79b39445fe9bd457fa22dbe87ae7600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f63617400000000000000000000000000000000000000000000000000000000006006556040518060400160405280603581526020016040518060400160405280600581526020017f79756e757300000000000000000000000000000000000000000000000000000081525081525060096000820151816000015560208201518160010190805190602001906200018892919062000218565b50505060405180604001604052806105ad81526020016040518060400160405280600781526020017f646176696e636900000000000000000000000000000000000000000000000000815250815250600b6000820151816000015560208201518160010190805190602001906200020192919062000218565b5050503480156200021157600080fd5b506200032d565b8280546200022690620002c8565b90600052602060002090601f0160209004810192826200024a576000855562000296565b82601f106200026557805160ff191683800117855562000296565b8280016001018555821562000296579182015b828111156200029557825182559160200191906001019062000278565b5b509050620002a59190620002a9565b5090565b5b80821115620002c4576000816000905550600101620002aa565b5090565b60006002820490506001821680620002e157607f821691505b60208210811415620002f857620002f7620002fe565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b610b62806200033d6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80638bab8dd5116100715780638bab8dd5146101565780639c8814f5146101865780639fcb4cab146101b7578063a4e1ca5a146101e7578063aa62479e14610218578063bc832d4e14610236576100a9565b80630ec57d51146100ae57806329a22b88146100cd578063471f7cdf146100fd5780636057361d1461011b57806377ec2b5514610137575b600080fd5b6100b6610252565b6040516100c49291906108b1565b60405180910390f35b6100e760048036038101906100e2919061077d565b6102ec565b6040516100f49190610896565b60405180910390f35b610105610302565b6040516101129190610896565b60405180910390f35b6101356004803603810190610130919061077d565b610308565b005b61013f610312565b60405161014d9291906108b1565b60405180910390f35b610170600480360381019061016b9190610734565b6103ac565b60405161017d9190610896565b60405180910390f35b6101a0600480360381019061019b919061077d565b6103da565b6040516101ae9291906108b1565b60405180910390f35b6101d160048036038101906101cc919061077d565b61048c565b6040516101de9190610896565b60405180910390f35b61020160048036038101906101fc919061077d565b6104b0565b60405161020f9291906108b1565b60405180910390f35b61022061056c565b60405161022d9190610896565b60405180910390f35b610250600480360381019061024b91906107aa565b610576565b005b600b80600001549080600101805461026990610a00565b80601f016020809104026020016040519081016040528092919081815260200182805461029590610a00565b80156102e25780601f106102b7576101008083540402835291602001916102e2565b820191906000526020600020905b8154815290600101906020018083116102c557829003601f168201915b5050505050905082565b60006005826102fb919061095e565b9050919050565b60085481565b8060088190555050565b600980600001549080600101805461032990610a00565b80601f016020809104026020016040519081016040528092919081815260200182805461035590610a00565b80156103a25780601f10610377576101008083540402835291602001916103a2565b820191906000526020600020905b81548152906001019060200180831161038557829003601f168201915b5050505050905082565b6015818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600f81600381106103ea57600080fd5b6002020160009150905080600001549080600101805461040990610a00565b80601f016020809104026020016040519081016040528092919081815260200182805461043590610a00565b80156104825780601f1061045757610100808354040283529160200191610482565b820191906000526020600020905b81548152906001019060200180831161046557829003601f168201915b5050505050905082565b600d818154811061049c57600080fd5b906000526020600020016000915090505481565b600e81815481106104c057600080fd5b90600052602060002090600202016000915090508060000154908060010180546104e990610a00565b80601f016020809104026020016040519081016040528092919081815260200182805461051590610a00565b80156105625780601f1061053757610100808354040283529160200191610562565b820191906000526020600020905b81548152906001019060200180831161054557829003601f168201915b5050505050905082565b6000600854905090565b60006040518060400160405280848152602001838152509050600e8190806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906105e192919061060c565b505050826015836040516105f5919061087f565b908152602001604051809103902081905550505050565b82805461061890610a00565b90600052602060002090601f01602090048101928261063a5760008555610681565b82601f1061065357805160ff1916838001178555610681565b82800160010185558215610681579182015b82811115610680578251825591602001919060010190610665565b5b50905061068e9190610692565b5090565b5b808211156106ab576000816000905550600101610693565b5090565b60006106c26106bd84610906565b6108e1565b9050828152602081018484840111156106de576106dd610af5565b5b6106e98482856109be565b509392505050565b600082601f83011261070657610705610af0565b5b81356107168482602086016106af565b91505092915050565b60008135905061072e81610b15565b92915050565b60006020828403121561074a57610749610aff565b5b600082013567ffffffffffffffff81111561076857610767610afa565b5b610774848285016106f1565b91505092915050565b60006020828403121561079357610792610aff565b5b60006107a18482850161071f565b91505092915050565b600080604083850312156107c1576107c0610aff565b5b60006107cf8582860161071f565b925050602083013567ffffffffffffffff8111156107f0576107ef610afa565b5b6107fc858286016106f1565b9150509250929050565b600061081182610937565b61081b8185610942565b935061082b8185602086016109cd565b61083481610b04565b840191505092915050565b600061084a82610937565b6108548185610953565b93506108648185602086016109cd565b80840191505092915050565b610879816109b4565b82525050565b600061088b828461083f565b915081905092915050565b60006020820190506108ab6000830184610870565b92915050565b60006040820190506108c66000830185610870565b81810360208301526108d88184610806565b90509392505050565b60006108eb6108fc565b90506108f78282610a32565b919050565b6000604051905090565b600067ffffffffffffffff82111561092157610920610ac1565b5b61092a82610b04565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000610969826109b4565b9150610974836109b4565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156109a9576109a8610a63565b5b828201905092915050565b6000819050919050565b82818337600083830152505050565b60005b838110156109eb5780820151818401526020810190506109d0565b838111156109fa576000848401525b50505050565b60006002820490506001821680610a1857607f821691505b60208210811415610a2c57610a2b610a92565b5b50919050565b610a3b82610b04565b810181811067ffffffffffffffff82111715610a5a57610a59610ac1565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b610b1e816109b4565b8114610b2957600080fd5b5056fea26469706673582212203afefce455c026cdaa76e8e41eda1a42b88ba483462805f8f74f7b376ca472ff64736f6c63430008070033",
   //     chainId: 1337,
   //   };

   //   const sentTxResponse = await wallet.sendTransaction(tx);
   //   await sentTxResponse.wait(1);
   //   console.log(sentTxResponse);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error)
      process.exit(1)
   })