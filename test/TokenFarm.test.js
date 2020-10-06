const DaiToken = artifacts.require('../src/contracts/DaiToken')
const DappToken = artifacts.require('../src/contracts/DappToken')
const TokenFarm = artifacts.require('../src/contracts/TokenFarm')

const chai = require('chai')

chai.use(require('chai-as-promised'))
    .should()

contract('TokenFarm', accounts => {

    let daiToken, dappToken, tokenFarm

    before(async() => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
    })

    describe('Mock Dai Deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name()

            assert.equal(name, 'Mock DAI Token')
        })
    })
})

