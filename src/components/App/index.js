import React, { Component } from "react";

import Web3 from "web3";

import Home from "../V1Home";
import Market from "../Market";
import Fan from "../HomeFan";
import Staking from "../HomeStaking"
import TronLinkGuide from "../TronLinkGuide";
import cons from "../../cons"

import abiToken from "../../token";
import abiMarket from "../../market";
import abiFan from "../../fan"
import abiStaking from "../../staking"
import abiFaucet from "../../faucet"

var addressToken = cons.TOKEN;
var addressMarket = cons.SC;
var addressFan = cons.SC2;
var addressStaking = cons.SC3;
var addressFaucet = cons.SC4;

var chainId = '0x38';

if(cons.WS){
  addressToken = cons.TokenTest;
  addressMarket = cons.SCtest;
  addressFan = cons.SC2test;
  addressStaking = cons.SC3test;
  addressFaucet = cons.SC4;
  chainId = '0x61';
}


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: false,
      metamask: false,
      conectado: false,
      currentAccount: null,
      binanceM:{
        web3: null,
        contractToken: null,
        contractMarket: null
      }
      
    };
  }

  async componentDidMount() {

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId}],
    });

    //TESTNET  '0x61'
    //mainet  '0x38'

      if (typeof window.ethereum !== 'undefined') {           
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          //console.log(accounts)
          this.setState({
            currentAccount: accounts[0],
            metamask: true,
            conectado: true
          })
        })
        .catch((error) => {
          console.error(error)
          this.setState({
            metamask: false,
            conectado: false
          })   
        });

      } else {    
        this.setState({
          metamask: false,
          conectado: false
        })         
           
      }

      setInterval(async() => {
        if (typeof window.ethereum !== 'undefined') {           
          window.ethereum.request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            //console.log(accounts)
            this.setState({
              currentAccount: accounts[0],
              metamask: true,
              conectado: true
            })
          })
          .catch((error) => {
            console.error(error)
            this.setState({
              metamask: false,
              conectado: false
            })   
          });
  
        } else {    
          this.setState({
            metamask: false,
            conectado: false
          })         
             
        }

      },7*1000);

    try {       
      var web3 = new Web3(window.web3.currentProvider);
      //var web3 = new Web3(window.web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/")); // TESTNET  '0x61'
      //var web3 = new Web3(window.web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));// mainet... 
      var contractToken = new web3.eth.Contract(
        abiToken,
        addressToken
      );
      var contractMarket = new web3.eth.Contract(
        abiMarket,
        addressMarket
      );
      var contractFan = new web3.eth.Contract(
        abiFan,
        addressFan
      );
      var contractStaking = new web3.eth.Contract(
        abiStaking,
        addressStaking
      );
      var contractFaucet = new web3.eth.Contract(
        abiFaucet,
        addressFaucet
      )

      this.setState({
        binanceM:{
          web3: web3,
          contractToken: contractToken,
          contractMarket: contractMarket,
          contractFan: contractFan,
          contractStaking: contractStaking,
          contractFaucet: contractFaucet
        }
      })
      
    } catch (error) {
        alert(error);
    }  

      

  }


  render() {

    var getString = "";
    var loc = document.location.href;
    //console.log(loc);
    if(loc.indexOf('?')>0){
              
      getString = loc.split('?')[1];
      getString = getString.split('#')[0];

    }

    if (!this.state.metamask) return (<TronLinkGuide />);

    if (!this.state.conectado) return (<TronLinkGuide installed />);

    switch (getString) {
      case "youtuber":
      case "myfavorite":
      case "fan": 
        return(<Fan wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
      case "staking":
        return(<Staking wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
      case "market":
        return(<Market wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
      default:
        return(<Home wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
    }


  }
}
export default App;

// {tWeb()}
