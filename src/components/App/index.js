import React, { Component } from "react";

import Web3 from "web3";

import Home from "../V1Home";
import Market from "../Market";
import MarketV2 from "../MarketV2";
import Fan from "../HomeFan";
import Staking from "../HomeStaking"
import TronLinkGuide from "../TronLinkGuide";
import cons from "../../cons"

import abiToken from "../../abi/token";
import abiMarket from "../../abi/market";
import abiInventario from "../../abi/inventario";
import abiFan from "../../abi/fan"
import abiStaking from "../../abi/staking"
import abiFaucet from "../../abi/faucet"
import abiExchange from "../../abi/exchange"

//const delay = (s) => new Promise((res) => setTimeout(res, s*1000));

var addressToken = cons.TOKEN;
var addressMarket = cons.SC;
var addressFan = cons.SC2;
var addressStaking = cons.SC3;
var addressFaucet = cons.SC4;
var chainId = cons.chainId;


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
      },
      baneado: true
      
    };

    this.conectar = this.conectar.bind(this);
  }

  async componentDidMount() {

    //this.conectar();

    setInterval(async() => {
      this.conectar();

    },3*1000);

  }

  async conectar(){

    if (typeof window.ethereum !== 'undefined') {

      this.setState({
        metamask: true
      }) 
          
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId}],
        });
        
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async(accounts) => {

          var ban = await fetch(cons.API+"api/v1/user/ban/"+accounts[0]);
          ban = await ban.text();

          if(ban === "true"){
            ban = true;
          }else{
            ban = false;
          }

          //console.log(accounts)
          this.setState({
            currentAccount: accounts[0],
            metamask: true,
            conectado: true,
            baneado: ban
          })
        })
        .catch((error) => {
          console.error(error)
          this.setState({
            metamask: true,
            conectado: false,
            baneado: false
          })   
        });
  
        var web3 = new Web3(window.web3.currentProvider); 
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
        );
        var contractInventario = new web3.eth.Contract(
          abiInventario,
          cons.SC5
        )
        var contractExchange = new web3.eth.Contract(
          abiExchange,
          cons.SC6
        )

        var loc = document.location.href;
        var walletconsulta = "0x0000000000000000000000000000000000000000"

        if(loc.indexOf('?')>0){
                  
          walletconsulta = loc.split('?')[1];
          walletconsulta = walletconsulta.split('#')[0];
          walletconsulta = walletconsulta.split('=')[1];
          
        }

        this.setState({
          walletconsulta: walletconsulta,
          binanceM:{
            web3: web3,
            contractToken: contractToken,
            contractMarket: contractMarket,
            contractFan: contractFan,
            contractStaking: contractStaking,
            contractFaucet: contractFaucet,
            contractInventario: contractInventario,
            contractExchange: contractExchange
          }
        })
  

        
    } else {    
      this.setState({
        metamask: false,
        conectado: false
      })         
          
    }

    
    }

  render() {

      var getString = "";
      var loc = document.location.href;
      //console.log(loc);
      if(loc.indexOf('?')>0){
                
        getString = loc.split('?')[1];
        getString = getString.split('#')[0];
        getString = getString.split('=')[0];
        
      }

      if (!this.state.metamask) return (<TronLinkGuide />);
  
      if (!this.state.conectado) return (<TronLinkGuide installed />);

      if(!this.state.baneado){
  
        switch (getString) {
          case "youtuber":
          case "myfavorite":
          case "fan": 
            return(<Fan wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
          case "staking":
            return(<Staking wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
          case "market":
            return(<Market wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
          case "market-v2":
            return(<MarketV2 wallet={this.state.binanceM} currentAccount={this.state.currentAccount} consulta={this.state.walletconsulta}/>);
          default:
            return(<Home wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>);
        }
      }else{
        return(<div style={{'paddingTop': '7em','textAlign':'center'}}><h1>HAS BANNED</h1></div>)
      }

   


  }
}
export default App;

// {tWeb()}
