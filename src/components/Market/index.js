import React, { Component } from "react";
const BigNumber = require('bignumber.js');

export default class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      inventario: [],
      itemsYoutube: [(
        <div className="col-lg-12 p-3 mb-5 text-center monedas position-relative" key={`items-0`}>
          <h2 className=" pb-2">Loading... please wait</h2>
        </div>
    )],
      balance: "Loading..."
    }

    this.balance = this.balance.bind(this);
    this.inventario = this.inventario.bind(this);
    this.items = this.items.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.update = this.update.bind(this);

  }

  async componentDidMount() {

    await this.update();

  }

  async update() {

    await this.balance();
    await this.inventario();
    await this.items();

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


  async buyItem(id){

    console.log("ento a comprar un bendito item")

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractMarket._address)
      .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado);
    aprovado = aprovado.shiftedBy(-18);
    aprovado = aprovado.decimalPlaces(2).toNumber();

    /*

    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance);
    balance = balance.shiftedBy(-18);
    balance = balance.decimalPlaces(0).toNumber();
    */

    console.log(aprovado);

    if(aprovado > 0){

        var result = await this.props.wallet.contractMarket.methods
          .buyItem(id)
          .send({ from: this.props.currentAccount });

        if(result){
          alert("item buy");
        }
    }else{
        alert("insuficient aproved balance")
      await this.props.wallet.contractToken.methods
      .approve(this.props.wallet.contractMarket._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });
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
    if(!this.state.loading){
      this.setState({
        loading: true
      });

      var itemsYoutube = [];
      var listItems = [];

      var result = await this.props.wallet.contractMarket.methods.largoItems().call({ from: this.props.currentAccount });
        //console.log(result)
        //{filter:"grayscale(100%)"}

      for (let index = 0; index < result; index++) {

        var item = await this.props.wallet.contractMarket.methods.items(index).call({ from: this.props.currentAccount });
        if(item.ilimitado || parseInt(item.cantidad) > 0){
          var eliminated = {};
        }else{
          eliminated = {filter:"grayscale(100%)"};
        }
        listItems[index]= item;
        //console.log(item)
        itemsYoutube[index] = (
            <div className="col-lg-3 col-md-6 p-3 mb-5 text-center monedas position-relative" key={`items-${index}`}>
              <h2 className=" pb-2"> Item #{index+1}</h2>
              <img
                className=" pb-2"
                src={"assets/img/" + item.nombre + ".png"}
                style={eliminated} 
                width="100%"
                alt=""
              />

              <h2 className="centradoFan">
                <b></b>
              </h2>

              <h2 className=" pb-2">{item.tipo}</h2>
              
              <div
                className="position-relative btn-monedas"
                onClick={() => {
                  if(listItems[index].ilimitado || parseInt(listItems[index].cantidad) > 0){
                    this.buyItem(index);
                  }else{
                    alert("Sold Out")
                  }
                  
                }}
              >
                <span className="position-absolute top-50 end-0 translate-middle-y p-5" >
                  {item.valor/10**18}
                </span>
              </div>
            </div>
        );

      }

      this.setState({
        itemsYoutube: itemsYoutube,
        loading: false
      });
    }
    
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

        //console.log(item)

        inventario[index] = (

          <div className="col-md-3 p-1" key={`itemsTeam-${index}`}>
            <img className="pb-4" src={"assets/img/" + item.nombre + ".png"} width="100%" alt={"team-"+item.nombre} />
          </div>

        )
    }

    this.setState({
      inventario: inventario
    })
  }

  render() {
    return (
      <><header className="masthead text-center text-white">
      <div className="masthead-content">
        <div className="container px-5">
        <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center bg-secondary bg-gradient">
              <h2 className=" pb-4">CSC available:</h2><br></br>
              <h3 className=" pb-4">{this.state.balance}</h3>
            </div>

          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center">
              <h2 className=" pb-4">Items</h2>
            </div>

            {this.state.itemsYoutube}

          </div>
        </div>
      </div>
    </header>

      </>
    );
  }
}
