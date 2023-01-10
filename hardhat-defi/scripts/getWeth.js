const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseUnits("0.02", "ether")

async function getWeth() {
    const { deployer } = await getNamedAccounts()

    // abi ✅ // contract address ✅
    // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )

    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)

    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`We have ${wethBalance} ETH in wETH`)
}

module.exports = { getWeth }
