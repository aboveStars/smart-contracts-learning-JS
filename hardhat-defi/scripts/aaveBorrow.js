const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth")

async function main() {
    await getWeth()

    const { deployer } = await getNamedAccounts()
    console.log(deployer.address)
    console.log("-------------------------")

    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool address: ${lendingPool.address}`)
    console.log("-------------------------")

    /*          Deposit              */
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    // approve...
    console.log("Approving....")
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    // depositing...
    console.log("Depositing....")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Depositing done.")
    console.log("-------------------------")

    /** Borrow Time  */
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer
    )

    const daiPrice = await getDaiPrice()

    const amountDaiToBorrow =
        availableBorrowsETH.toString() * 0.7 * (1 / daiPrice.toNumber())
    console.log(`You can borrow ${amountDaiToBorrow} Dai`)
    const amountDaiToBorrowWei = ethers.utils.parseUnits(
        amountDaiToBorrow.toString(),
        "ether"
    )
    console.log("-------------------------")

    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    console.log("Borrowing.....")
    await borrowDai(
        daiTokenAddress,
        lendingPool,
        amountDaiToBorrowWei,
        deployer
    )

    await getBorrowUserData(lendingPool, deployer)
    console.log("-------------------------")
    console.log("Repaying......")
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    console.log("-------------------------")
    await getBorrowUserData(lendingPool, deployer)
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    repayTx.wait(1)
    console.log("Repaid!")
}

async function borrowDai(
    daiAddress,
    lendingPool,
    amountDaiToBorrowWei,
    account
) {
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        amountDaiToBorrowWei,
        1,
        0,
        account
    )

    await borrowTx.wait(1)
    console.log("Borrowed successfully")
}

async function getDaiPrice() {
    const { deployer } = await getNamedAccounts()
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4",
        deployer
    )
    const { answer } = await daiEthPriceFeed.latestRoundData()
    console.log(`The DAI/ETH price is ${answer}`)
    return answer
}

async function getBorrowUserData(lendingPool, signer) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(signer)
    console.log(`
    You Have ${totalCollateralETH} worth of ETH Deposited.
    You Have ${totalDebtETH} worth of ETH Borrowed.
    You can borrow ${availableBorrowsETH} worth of ETH.
    `)
    return { availableBorrowsETH, totalDebtETH }
}

async function approveErc20(
    erc20address,
    spenderAddress,
    amountToSpend,
    signer
) {
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20address,
        signer
    )

    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved")
}

async function getLendingPool(signer) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        signer
    )

    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        signer
    )

    return lendingPool
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
