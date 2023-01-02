const { assert, expect } = require("chai")
const { network, getNamedAccounts, ethers, waffle } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-harhdat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])

              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)

              const subId = await raffle.getSubscriptionId()
              vrfCoordinatorV2Mock.addConsumer(subId, raffle.address)

              raffleEntranceFee = networkConfig[network.config.chainId]["entranceFee"]
              interval = networkConfig[network.config.chainId]["interval"]
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
      })
