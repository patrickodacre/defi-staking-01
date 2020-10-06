const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
    // put all tokens on the blockchain
    const _daiToken = new DaiToken(web3.utils.toWei('1000000', 'ether'))
    await deployer.deploy(_daiToken)
    const daiToken = await _daiToken.deployed()

    const _dappToken = new DappToken(web3.utils.toWei('1000000', 'ether'))
    await deployer.deploy(_dappToken)
    const dappToken = await _dappToken.deployed()

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
    const tokenFarm = await TokenFarm.deployed()

    // transfer all Dapp Tokens to the token farm for distributing to investors
    // 1 million tokens
    await dappToken.transfer(tokenFarm.address, "1000000000000000000000000")

    // transfer 100 mock dai tokens to an investor
    // in ganache we have a list of accounts
    // the first account is the deployer, so [1] is an investor
    await daiToken.transfer(accounts[1], "1000000000000000000000000")
};
