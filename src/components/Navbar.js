import React, { Component } from 'react'
import farmer from '../farmer.png'
import Web3 from 'web3'

class Navbar extends Component {

    async loadData() {
        const [account] = await window.web3.eth.getAccounts()

        this.setState({account})
    }

    async loadWeb3() {
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
        }
    }

    constructor(props) {
        super(props)

        this.loadWeb3 = this.loadWeb3.bind(this)
        this.loadData = this.loadData.bind(this)
        this.loadEth = this.loadEth.bind(this)

        this.state = {
            account: null,
        }
    }

    async loadEth() {
        await this.loadWeb3()
        await this.loadData()
    }

  render() {

      let accountButton

      if (this.state.account) {
          accountButton = <small className="text-secondary">
              <small id="account">{this.state.account}</small>
              </small>
      } else {
          accountButton = <button class="btn btn-primary" onClick={this.loadEth}>Enable Ethereum</button>
      }

    return (
      <nav className="navbar navbar-dark bg-dark flex-md-nowrap mb-4 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; DApp Token Farm
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            {accountButton}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
