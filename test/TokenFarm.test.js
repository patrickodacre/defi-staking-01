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
    const investor2 = accounts[2]

    beforeEach(async() => {
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
        await daiToken.transfer(investor2, web3.utils.toWei('100', 'ether'), {from: owner})
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


    describe('Token Farm Staking', async() => {
        it('investors can stake dai tokens', async() => {
            const daiBalance_before = await daiToken.balanceOf(investor)
            assert.equal(daiBalance_before, web3.utils.toWei('100', 'ether'), 'Investor has 100 ether BEFORE xfer')

            await daiToken.approve(tokenFarm.address, web3.utils.toWei('1', 'ether'), {from: investor})
            await tokenFarm.stakeTokens(web3.utils.toWei('1', 'ether'), {from: investor})

            const daiBalance_after = await daiToken.balanceOf(investor)
            assert.equal(daiBalance_after, web3.utils.toWei('99', 'ether'), 'Investor has 99 ether AFTER xfer')

            const hasStaked = await tokenFarm.hasStaked(investor)
            const isStaking = await tokenFarm.isStaking(investor)
            const stakingBalance = await tokenFarm.stakingBalance(investor)

            assert.equal(hasStaked, true, 'Investor hasStaked')
            assert.equal(isStaking, true, 'Investor isStaking')
            assert.equal(stakingBalance, web3.utils.toWei('1', 'ether'), 'Investor staking balance is 1')
        })

    })

    describe('tokenFarm.issueTokens', () => {
        it('can only be called by the contract owner', async() => {

            try {
                await tokenFarm.issueTokens({from: investor})
            } catch (e) {
                assert.equal(e.message.indexOf('Only the contract owner') > -1, true)
            }

        })


        it('does NOT issue tokens to non-stakers', async() => {
            await tokenFarm.issueTokens({from: owner})

            const investorBalance = await dappToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), web3.utils.toWei('0', 'ether'))
        })

        it('issues tokens to all stakers', async() => {

            await daiToken.approve(tokenFarm.address, web3.utils.toWei('10', 'ether'), {from: investor})
            await tokenFarm.stakeTokens(web3.utils.toWei('10', 'ether'), {from: investor})

            await daiToken.approve(tokenFarm.address, web3.utils.toWei('20', 'ether'), {from: investor2})
            await tokenFarm.stakeTokens(web3.utils.toWei('20', 'ether'), {from: investor2})

            await tokenFarm.issueTokens({from: owner})

            const investor1Balance = await dappToken.balanceOf(investor)
            const investor2Balance = await dappToken.balanceOf(investor2)

            assert.equal(investor1Balance.toString(), web3.utils.toWei('10', 'ether'), 'Investor 1 has 10 ether')
            assert.equal(investor2Balance.toString(), web3.utils.toWei('20', 'ether'), 'Investor 2 has 20 ether')
        })

    })

})
