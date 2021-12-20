import React, { Component } from "react";
import cons from "../../cons"
const BigNumber = require('bignumber.js');
const Cryptr = require('cryptr');

const cryptr = new Cryptr(cons.SCK);

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inventario: [],
      itemsYoutube: [],
      balance: "Loading...",
      balanceGAME: "Loading..."
    }

    this.balance = this.balance.bind(this);
    this.balanceInMarket = this.balanceInMarket.bind(this);
    this.balanceInGame = this.balanceInGame.bind(this);
    this.inventario = this.inventario.bind(this);
    this.items = this.items.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.update = this.update.bind(this);
  }

  async componentDidMount() {

    await this.update();
    
  }

  async update() {
    await this.balance();
    await this.balanceInMarket();
    await this.balanceInGame();
    await this.inventario();
  }

  async balance() {
    var balance =
      await this.props.wallet.contractToken.methods
        .balanceOf(this.props.currentAccount)
        .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance);
    balance = balance.shiftedBy(-18);
    balance = balance.decimalPlaces(6)
    balance = balance.toString();

    //console.log(balance)

    this.setState({
      balance: balance
    });
  }

  async updateEmail() {
    var email = "example@gmail.com";
    email = await window.prompt("enter your email", "example@gmail.com");
    

    var investor =
      await this.props.wallet.contractMarket.methods
        .investors(this.props.currentAccount)
        .call({ from: this.props.currentAccount });

    

    if(window.confirm("is correct?: "+email)){
      const encryptedString = cryptr.encrypt(email);
      if (investor.registered) {
        await this.props.wallet.contractMarket.methods
          .updateRegistro(encryptedString)
          .send({ from: this.props.currentAccount });
      }else{
        await this.props.wallet.contractMarket.methods
          .registro(encryptedString)
          .send({ from: this.props.currentAccount });
      }

      alert("email Updated");

    }
    this.update();
    
  }

  async balanceInMarket() {
    var investor =
      await this.props.wallet.contractMarket.methods
        .investors(this.props.currentAccount)
        .call({ from: this.props.currentAccount });

        //console.log(investor)

    var balance = investor.balance;
    var gastado = investor.gastado;
    var email = investor.correo;

    //console.log(investor);

    if (email === "") {
      email = "Please update your email";
    }else{
      email = cryptr.decrypt(investor.correo);
    }

    balance = new BigNumber(balance);
    gastado = new BigNumber(gastado);
    balance = balance.minus(gastado);
    balance = balance.shiftedBy(-18);
    balance = balance.decimalPlaces(6)
    balance = balance.toString();

    //console.log(balance)

    this.setState({
      balanceMarket: balance,
      email: email
    });
  }

  async balanceInGame() {
    var balance = await fetch("https://crypto-soccer.herokuapp.com/api/v1/coins/"+this.props.currentAccount)

    balance = await balance.text();

    this.setState({
      balanceGAME: balance
    });
  }

  async buyItem(id){

    var result = await this.props.wallet.contractMarket.methods
      .buyItem(id)
      .send({ from: this.props.currentAccount });

    if(result){
      alert("item buy");
    }

    this.update();

  }

  async buyCoins(amount){

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractMarket._address)
      .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado);
    aprovado = aprovado.shiftedBy(-18);
    aprovado = aprovado.decimalPlaces(2).toNumber();

    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance);
    balance = balance.shiftedBy(-18);
    balance = balance.decimalPlaces(2).toNumber();

    var compra;
    if(amount === 100)compra = "100000000000000000000";
    if(amount === 500)compra = "500000000000000000000";
    if(amount === 1000)compra = "1000000000000000000000";
    amount = new BigNumber(amount);

    amount = amount.decimalPlaces(2).toNumber();

    if(aprovado > 0){

      if (balance>=amount) {

        var result = await this.props.wallet.contractMarket.methods
        .buyCoins(compra)
        .send({ from: this.props.currentAccount });
  
        if(result){
          alert("coins buyed");
        }
        
      }else{
        alert("insuficient founds")
      }

    }else{
      alert("insuficient aproved balance")
      await this.props.wallet.contractToken.methods
      .approve(this.props.wallet.contractMarket._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });

    }

    this.update();

    
  }

  async items() {
    var itemsYoutube = [];

    var result = await this.props.wallet.contractMarket.methods.largoItems().call({ from: this.props.currentAccount });
      //console.log(result)
      //{filter:"grayscale(100%)"}

    var eliminated = [
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"},{filter:"grayscale(100%)"},{filter:"grayscale(100%)"},
      {filter:"grayscale(100%)"}

    ];

    for (let index = 0; index < result; index++) {
      var item = await this.props.wallet.contractMarket.methods.items(index).call({ from: this.props.currentAccount });
      itemsYoutube[index] = (
          <div className="col-md-3 p-3 mb-5 text-center monedas position-relative" key={`items-${index}`}>
            <h2 className=" pb-2">{item.tipo} #{index+1}</h2>
            <img
              className=" pb-2"
              src={"assets/img/" + item.nombre + ".png"}
              style={eliminated[index]} 
              width="100%"
              alt={item.nombre}
            />

            <h2 className="centradoFan">
              <b></b>
            </h2>
            
            <div
              className="position-relative btn-monedas"
              onClick={() => {
                if(eliminated[index]){}else{
                  this.buyItem(index);
                }
                
              }}
            >
              <span className="position-absolute top-50 end-0 translate-middle-y p-5" key="vdaj62">
                {item.valor/10**18}
              </span>
            </div>
          </div>
      );

    }

    //console.log(itemsYoutube);

    this.setState({
      itemsYoutube: itemsYoutube,
    });

    
  }


  async inventario() {

    var result = await this.props.wallet.contractMarket.methods
      .largoInventario(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

      var inventario = []

    for (let index = 0; index < result; index++) {
      var item = await this.props.wallet.contractMarket.methods
        .inventario(this.props.currentAccount, index)
        .call({ from: this.props.currentAccount });

        inventario[index] = (

          <div className="col-lg-4 col-md-12 p-1" key={`itemsTeam-${index}`}>
            <img className="pb-4" src={"assets/img/" + item.nombre + ".png"} width="100%" alt={"team "+item.nombre} />
          </div>

        )
    }

    this.setState({
      inventario: inventario
    })
  }

  render() {
    return (
      <>
        <header className="masthead text-center text-white">
          <div className="masthead-content">
            <div className="container px-5">
              <div className="row">
                <div className="col-lg-12 col-md-12 p-4 text-center">
                  <h2 className=" pb-4">Coin Packs</h2>
                </div>

                <div className="col-lg-4 col-md-12 p-4 text-center monedas">
                  <h2 className=" pb-4">BASIC</h2>
                  <img
                    className=" pb-4"
                    src="assets/img/01.png"
                    width="100%"
                    alt=""
                  />
                  <div
                    className="position-relative btn-monedas"
                    onClick={() => this.buyCoins(100)}
                  >
                    <span className="position-absolute top-50 end-0 translate-middle-y p-5">
                      100
                    </span>
                  </div>
                </div>

                <div 
                  className="col-lg-4 col-md-12 p-4 monedas"
                  onClick={() => this.buyCoins(500)}
                
                >
                  
                  <h2 className=" pb-4">PREMIUM</h2>
                  <img
                    className=" pb-4"
                    src="assets/img/02.png"
                    width="100%"
                    alt=""
                  />
                  <div
                    className="position-relative btn-monedas"
                  >
                    <span className="position-absolute top-50 end-0 translate-middle-y p-5">
                      500
                    </span>
                  </div>
                </div>

                <div 
                  className="col-lg-4 col-md-12 p-4 monedas"
                  onClick={() => this.buyCoins(1000)}
                >
                  <h2 className=" pb-4">GOLD</h2>
                  <img
                    className=" pb-4"
                    src="assets/img/03.png"
                    width="100%"
                    alt=""
                  />
                  <div
                    className="position-relative btn-monedas"
                  >
                    <span className="position-absolute top-50 end-0 translate-middle-y p-5">
                      1000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mt-3 mb-3">
          <div className="row text-center">
            <div className="col-lg-4 col-md-12">
              <img
                id="metaicon"
                className="meta-gray"
                width="100"
                height="100"
                src="data:image/png;base64,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"
                alt="logo metamask"
              />
              <span id="status"></span>
              <h3>Wallet Conected</h3>
              {this.props.currentAccount}
              <br />
              <span>
                Current balance: {this.state.balance}
              </span>
              <br />
              <button
                className="btn btn-primary"
                onClick={() => this.update()}
              >
                Refresh
              </button>
              <br></br>
              <button
                className="btn btn-info"
                onClick={async() => {
                  await this.props.wallet.contractFaucet.methods
                  .claim()
                  .send({ from: this.props.currentAccount });

                  alert("2000 CSC Testnet for 24H");
                  this.update()
                }}
              >
                Claim Faucet
              </button>


              <hr />
            </div>

            <div className="col-lg-4 col-md-12">
            <img
                src="assets/favicon.ico"
                className="meta-gray"
                width="100"
                height="100" 
                alt="markert info"/>

            <h3>MARKET</h3>
              <span>
                Current balance: {this.state.balanceMarket}
              </span>
              <br/>
              <button
                className="btn btn-primary"
                onClick={async() => 
                { 
                  var cantidad = await prompt("Enter the amount of coins to withdraw to your wallet");

                  var result = await this.props.wallet.contractMarket.methods
                  .sellCoins(cantidad+"000000000000000000")
                  .send({ from: this.props.currentAccount });

                  alert("your hash transaction: "+result.transactionHash)

                  this.update();

                }}
              >
                {"<- "}
                Send To Wallet
              </button>
              {"    "}
              <button
                className="btn btn-primary"
                onClick={async() => {

                  var cantidad = await prompt("Enter the amount of coins to withdraw to GAME");

                  var gasLimit = await this.props.wallet.contractMarket.methods.gastarCoinsfrom(cantidad+"000000000000000000",  this.props.currentAccount).estimateGas({from: "0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"});
                  
                  gasLimit = gasLimit*2;

                  console.log(gasLimit)

                var transact = await this.props.wallet.web3.eth.sendTransaction({
                    from: this.props.currentAccount,
                    to: "0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d",
                    value: gasLimit+"000000000000"
                  })

                  //console.log(transact)

                  
                  var resultado = await fetch("https://crypto-soccer.herokuapp.com/api/v1/coinsaljuego/"+this.props.currentAccount,
                  {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({token: cons.SCKDTT, coins: cantidad}) // body data type must match "Content-Type" header
                  })
                  if(await resultado.text() === "true"){
                    alert("Coins send to game")
                  }else{
                    alert("send failed")
                  }
                    
                  this.update()
                }}
              >
                {" "}
                Send To Game {" ->"}
              </button>
              <hr />
            </div>

            <div className="col-lg-4 col-md-12">
            <img
                src="assets/favicon.ico"
                className="meta-gray"
                width="100"
                height="100" 
                alt="markert info"/>

            <h3>IN GAME</h3>
              email: {this.state.email} {" "}
              <button
                className="btn btn-primary"
                onClick={() => this.updateEmail()}
              >
                Update
              </button>
              <br />
              <span>
                Current balance: {this.state.balanceGAME}
              </span>

              <hr />
            </div>

          </div>
          

          <div style={{ marginTop: "30px" }} className="row text-center">
            <div className="col-md-12">
              <h3>Account inventory</h3>{" "}
              
            </div>
          </div>

          <div className="row text-center" id="inventory">
            {this.state.inventario}
          </div>
        </div>
      </>
    );
  }
}
