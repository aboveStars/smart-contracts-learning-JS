const { assert, expect } = require("chai")
const { network, getNamedAccounts, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-harhdat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval, firstTimeStamp

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])

              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)

              const subId = await raffle.getSubscriptionId()
              vrfCoordinatorV2Mock.addConsumer(subId, raffle.address)

              raffleEntranceFee = networkConfig[network.config.chainId]["entranceFee"]
              interval = networkConfig[network.config.chainId]["interval"]

              firstTimeStamp = await raffle.getLastTimeStamp()
          })

          describe("constructor", function () {
              it("initialize Raffle Correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")

                  const interval = await raffle.getInterval()
                  assert.equal(
                      interval.toString(),
                      networkConfig[network.config.chainId]["interval"]
                  )

                  const entranceFee = await raffle.getEntranceFee()
                  assert.equal(entranceFee.toString(), raffleEntranceFee)
              })
          })

          describe("enterRaffle", function () {
              it("reverts when you dont pay enough...", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughFee")
              })

              it("records players when enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })
              it("emits event on enter", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.emit(
                      raffle,
                      "RaffleEnter"
                  )
              })

              it("deoesnt allow entrance when not open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [Number(interval) + 1])
                  await network.provider.send("evm_mine", [])

                  await raffle.performUpkeep([])
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "Raffle__NOTOPEN"
                  )
              })
          })

          describe("checkUpKeep", function () {
              it("returns false if people havent send any eth...", async function () {
                  await network.provider.send("evm_increaseTime", [Number(interval) + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })
              it("returns false if raffle isnt open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [Number(interval) + 1])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep([])
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "1")
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert.equal(upkeepNeeded, false)
              })
          })

          describe("performUpKeep", function () {
              it("it can only run if checkUpKeepTrue", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee }) // players and hasBalance done.
                  await network.provider.send("evm_increaseTime", [Number(interval) + 1]) // time done -1
                  await network.provider.send("evm_mine", []) // time done -2
                  // we are ready for perform....

                  const tx = await raffle.performUpkeep([])
                  assert(tx)
              })

              it("reverts when checkupkeep false", async function () {
                  const tx = raffle.performUpkeep([])
                  expect(tx).to.be.revertedWith("Raffle__UpkeepNotNeeded")
              })

              it("updates the raffle state, and calls vrf coordinator....", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [Number(interval) + 1])
                  await network.provider.send("evm_mine", [])

                  const tx = await raffle.performUpkeep([])
                  const txR = await tx.wait(1)

                  const requestId = txR.events[1].args.requestId
                  assert(Number(requestId) > 0)

                  const raffleState = await raffle.getRaffleState()
                  assert(raffleState.toString() == "1")
              })
          })

          describe("fullFillRandomWords", function () {
              beforeEach(async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [Number(interval) + 1])
                  await network.provider.send("evm_mine", [])

                  // To prepare...
              })

              it("can only be called after perform up keep", async function () {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
                  ).to.be.revertedWith("nonexistent request")
              })
              it("picks a winner, reset lottery, send money", async function () {
                  const additionalEntrants = 3
                  const startingAccountIndex = 1 // deployer 0
                  const accounts = await ethers.getSigners()
                  for (
                      let i = startingAccountIndex;
                      i < startingAccountIndex + additionalEntrants;
                      i++
                  ) {
                      const accountConnectedRaffle = await raffle.connect(accounts[i])
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                  }

                  const startingTimeStamp = await raffle.getLastTimeStamp()

                  // performUpKeep (mock being chainlink keepers)
                  // fulfillrandomwords(mock being chainlinks vrf)
                  // we will have to wait for the fullfill to be called.

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Found the event")
                          const recentWinner = await raffle.getRecentWinner()
                          console.log(`Recent Winner: ${recentWinner.toString()}`)

                          raffle_state = await raffle.getRaffleState()
                          playerNumbers = await raffle.getPlayersLength()
                          lastTimeStamp = await raffle.getLastTimeStamp()
                          winnerEndingBalance = await accounts[1].getBalance()

                          try {
                              assert(raffle_state.toString() == "0")
                              assert(playerNumbers.toString() == "0")
                              assert(lastTimeStamp.toString() > startingTimeStamp.toString())
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(balanceInContract).toString()
                              )
                          } catch (e) {
                              reject(e)
                          }
                          resolve()
                      })

                      const tx = await raffle.performUpkeep([])
                      const txR = await tx.wait(1)
                      const winnerStartingBalance = await accounts[1].getBalance()
                      const balanceInContract = await raffle.getBalanceOfContract()
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txR.events[1].args.requestId,
                          raffle.address
                      )
                  })
              })
          })

          describe("Interval is in action", function () {
              it("interval control", async function () {
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Found the event")
                          try {
                              // getting values:
                              const lastTimeStamp = await raffle.getLastTimeStamp()
                              // assertion...
                              console.log(
                                  `Our Result Should Be: ${lastTimeStamp
                                      .sub(firstTimeStamp)
                                      .toString()}`
                              )
                              assert(lastTimeStamp.sub(firstTimeStamp) >= interval)
                          } catch (error) {
                              reject(error)
                          }
                          resolve()
                      })

                      console.log("entering raffle")
                      await raffle.enterRaffle({ value: raffleEntranceFee })

                      console.log("time-travel")
                      await network.provider.send("evm_increaseTime", [Number(interval) + 1])
                      await network.provider.send("evm_mine", [])

                      console.log("performing upkeep")
                      tx = await raffle.performUpkeep([])
                      txR = await tx.wait(1)

                      console.log("vrf...")
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txR.events[1].args.requestId,
                          raffle.address
                      )
                      console.log("vrf done")
                  })
              })
          })
      })
