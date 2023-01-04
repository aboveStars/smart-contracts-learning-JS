const { assert, expect } = require("chai")
const { network, getNamedAccounts, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-harhdat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async function () {
          let raffle, raffleEntranceFee, deployer, startingTimeStamp, interval

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              startingTimeStamp = await raffle.getLastTimeStamp()
              interval = await raffle.getInterval()
          })

          describe("everything....", function () {
              it("can we get a random winner", async function () {
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async function () {
                          console.log("WinnerPicked event detected.")
                          try {
                              console.log("Getting needed values from contract.......")
                              const recentWinner = await raffle.getRecentWinner()
                              const raffle_state = await raffle.getRaffleState()
                              const winnerFinalBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()
                              console.log("getting values are done")

                              console.log("Assertion Tests are being started.................")
                              assert.equal(recentWinner.toString(), accounts[0].address.toString())
                              assert.equal(raffle_state.toString(), "0")
                              assert(endingTimeStamp.sub(startingTimeStamp) >= Number(interval))
                              assert.equal(
                                  winnerFinalBalance.toString(),
                                  winnerStartingBalance
                                      .add(contractBalanceBeforeSelecitngWinner)
                                      .toString()
                              )
                              console.log("All tests are done. We are `resolving` our promise")
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
