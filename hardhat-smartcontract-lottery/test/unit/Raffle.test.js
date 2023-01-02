const { assert, expect } = require("chai")
const { network, getNamedAccounts, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-harhdat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async function () {
          let raffle, vrfCoordiantorV2Mock, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordiantorV2Mock = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = networkConfig[network.config.chainId]["entranceFee"]
          })

          describe("constructor", async function () {
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

          describe("enterRaffle", async function () {
              it("reverts when you dont pay enough...", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughFee")
              })

              it("records players when enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })
          })
      })
