const DaiToken = artifacts.require('../src/contracts/DaiToken')
const DappToken = artifacts.require('../src/contracts/DappToken')
const TokenFarm = artifacts.require('../src/contracts/TokenFarm')

const chai = require('chai')

chai.use(require('chai-as-promised'))
    .should()

contract('TokenFarm', accounts => {

    let daiToken, dappToken, tokenFarm
    const owner = accounts[0]
    const investor = accounts[1]

    before(async() => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // transfer all Dapp Tokens to the farm (1 million)
        // await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
        await dappToken.transfer(tokenFarm.address, web3.utils.toWei('1000000', 'ether'))

        // accounts[0] is the one who deployed the DAI token and they own all the Mock DAI tokens:
        /*
          constructor() public {
            balanceOf[msg.sender] = totalSupply;
          }
         */
        await daiToken.transfer(investor, web3.utils.toWei('100', 'ether'), {from: owner})
    })

    describe('Mock Dai Deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name()

            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('DApp Token Deployment', async() => {
        it('has a name', async() => {
            const name = await dappToken.name()

            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm Deployment', async() => {
        it('has a name', async() => {
            const name = await tokenFarm.name()

            assert.equal(name, 'DApp Token Farm')
        })

        it('investor has 100 Mock DAI', async() => {
            const balance = await daiToken.balanceOf(investor)

            assert.equal(balance.toString(), web3.utils.toWei('100', 'ether'))
        })

        it('has 1 million DApp Tokens', async() => {
            const balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), web3.utils.toWei('1000000', 'ether'))
        })
    })

})
