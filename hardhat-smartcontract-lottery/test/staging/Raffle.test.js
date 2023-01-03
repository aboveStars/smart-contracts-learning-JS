const { assert, expect } = require("chai")
const { network, getNamedAccounts, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-harhdat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("everything....", function () {
              it("can we get a random winner", async function () {
                  const startingTimeStamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async function () {
                          console.log("WinnerPicked fired.... We are starting asserting...")
                          try {
                              console.log("Getting values from contract.......")
                              const recentWinner = await raffle.getRecentWinner()
                              const raffle_state = await raffle.getRaffleState()
                              const winnerFinalBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()
                              console.log("Finished.......")

                              console.log("Test are being started.................")
                              assert.equal(recentWinner.toString(), accounts[0].address.toString())
                              assert.equal(raffle_state.toString(), "0")
                              assert.equal(
                                  winnerFinalBalance.toString(),
                                  winnerStartingBalance
                                      .add(contractBalanceBeforeSelecitngWinner)
                                      .toString()
                              )
                              console.log("All test are done. We are `resolving` our promise")
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })
                      console.log("---------------------------")

                      console.log("We are entering to raffle")
                      tx = await raffle.enterRaffle({ value: raffleEntranceFee })

                      console.log("---------------------------")

                      console.log("Pending 5 Blocks....")
                      await tx.wait(5)
                      
                      console.log("---------------------------")
                      console.log("We are getting winner balance after entering to raffle...")
                      console.log("---------------------------")
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log(
                          `winner_starting_balance is : ${winnerStartingBalance.toString()}`
                      )
                      console.log("---------------------------")

                      console.log("We are getting balance of contract")
                      const contractBalanceBeforeSelecitngWinner =
                          await raffle.getBalanceOfContract()
                      console.log(
                          `contract_balance_to_give is : ${contractBalanceBeforeSelecitngWinner}`
                      )
                      console.log("---------------------------")
                  })
              })
          })
      })
