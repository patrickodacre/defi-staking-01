import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {

  constructor(props) {
    super(props)

      this.state = {
          account: null,
          daiToken: {},
          dappToken: {},
          tokenFarm: {},
          daiTokenBalance: '0',
          dappTokenBalance: '0',
          stakingBalance: '0',
          loading: false,
      }
  }

    loadEth = async () => {
        try {
            this.setState({loading: true})
            await this.loadWeb3()
            await this.loadData()
            this.setState({loading: false})
        } catch (e) {
            this.setState({loading: false})
            console.error(e.message)
            alert('Failed to connect to the network.')
        }
    }

    loadData = async () => {
        const {web3} = window
        const [account] = await web3.eth.getAccounts()

        this.setState({account})

        const networkID = await web3.eth.net.getId()

        // DAI Token
        {
            const tokenData  = DaiToken.networks[networkID]
            const check = DaiToken
            if (tokenData && tokenData.address) {
                const daiToken = await new web3.eth.Contract(DaiToken.abi, tokenData.address)
                this.setState({daiToken})

                const balance = await daiToken.methods.balanceOf(this.state.account).call()
                this.setState({daiTokenBalance: balance.toString()})
            } else {
                throw new Error('DAI Token contract not deployed to the detected network.')
            }
        }

        // Dapp Token
        {
            const tokenData  = DappToken.networks[networkID]
            if (tokenData && tokenData.address) {
                const dappToken = await new web3.eth.Contract(DappToken.abi, tokenData.address)
                this.setState({dappToken})

                const balance = await dappToken.methods.balanceOf(this.state.account).call()
                this.setState({dappTokenBalance: balance.toString()})
            } else {
                throw new Error('Dapp Token contract not deployed to the detected network.')
            }
        }

        // Token Farm
        {
            const tokenData  = TokenFarm.networks[networkID]
            if (tokenData && tokenData.address) {
                const tokenFarm = await new web3.eth.Contract(TokenFarm.abi, tokenData.address)
                this.setState({tokenFarm})

                const balance = await tokenFarm.methods.stakingBalance(this.state.account).call()
                this.setState({stakingBalance: balance.toString()})
            } else {
                throw new Error('Token Farm contract not deployed to the detected network.')
            }
        }

    }

    loadWeb3 = async () => {
        // ethereum object is set by
        // https://eips.ethereum.org/EIPS/eip-1193
        // compliant providers like MetaMask
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (Web3 && Web3.currentProvider) {
            window.web3 = new Web3(Web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
            throw new Error('Non-Ethereum browser detected.')
        }
    }

  render() {
    return (
      <div>
        <Navbar onLoadEth={this.loadEth} account={this.state.account}/>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
