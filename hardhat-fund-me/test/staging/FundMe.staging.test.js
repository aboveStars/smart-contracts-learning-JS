const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.5")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              console.log("Funding...")
              const transactionResponse = await fundMe.fund({
                  value: sendValue,
              })
              console.log("Verifing Fund...")
              await transactionResponse.wait(1)

              console.log("Withdrawing...")
              const transactionResponse2 = await fundMe.withDraw()
              console.log("Verifing WITHDRAW...")
              await transactionResponse2.wait(1)

              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), 0)
          })
      })
