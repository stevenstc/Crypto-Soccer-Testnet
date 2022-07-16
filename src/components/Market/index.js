import React, { Component } from "react";
const BigNumber = require('bignumber.js');

export default class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      inventario: [],
      itemsMarket: [(
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

    this.update();

  }

  async update() {

    this.balance();
    this.inventario();
    this.items();

  }

  async balance() {
    var balance =
      await this.props.wallet.contractToken.methods
        .balanceOf(this.props.currentAccount)
        .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).toString(10);

    this.setState({
      balance: balance
    });
  }


  async buyItem(id){

    console.log("ento a comprar un item")

    var aprovado = await this.props.wallet.contractToken.methods
      .allowance(this.props.currentAccount, this.props.wallet.contractInventario._address)
      .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber(10);

    /*
    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(0).toNumber();
    */

    if(aprovado > 0){

        var result = await this.props.wallet.contractInventario.methods
          .buyItemsGame(id)
          .send({ from: this.props.currentAccount });

        if(result){
          alert("item buy");
        }
    }else{
        alert("insuficient aproved balance")
      await this.props.wallet.contractToken.methods
      .approve(this.props.wallet.contractInventario._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
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

      var itemsMarket = [];
      var listItems = [];

      var _items = await this.props.wallet.contractInventario.methods
      .verItemsMarket()
      .call({ from: this.props.currentAccount });

      console.log(_items)

      //{filter:"grayscale(100%)"}

      for (let index = 0; index < _items[0].length; index++) {

        var item = {ilimitado: _items[1][index]};
        if(item.ilimitado || parseInt(item.cantidad) > 0){
          var eliminated = {};
        }else{
          eliminated = {filter:"grayscale(100%)"};
        }
        listItems[index]= item;
        //console.log(item)
        itemsMarket[index] = (
            <div className="col-lg-3 col-md-6 p-3 mb-5 text-center monedas position-relative border" key={`items-${index}`}>
              <h2 className=" pb-2"> {(_items[0][index]).replace(/-/g," ").replace("comun", "common").replace("formacion","formation").replace("epico","epic").replace("legendario","legendary")}</h2>
              <img
                className=" pb-2"
                src={"assets/img/" + _items[0][index] + ".png"}
                style={eliminated} 
                width="100%"
                alt=""
              />

              <h2 className="centradoFan">
                <b></b>
              </h2>
              
              <div className="position-relative">
                <button className="btn btn-success" onClick={() => {
                  if(listItems[index].ilimitado || parseInt(listItems[index].cantidad) > 0){
                    this.buyItem(index);
                  }else{
                    alert("Sold Out")
                  }
                  
                }}>
                  Buy for {new BigNumber(_items[3][index]).shiftedBy(-18).toString(10)} CSC
                </button>
              </div>
            </div>
        );

      }

      this.setState({
        itemsMarket: itemsMarket,
        loading: false
      });
    }
    
  }


  async inventario() {

    var result = await this.props.wallet.contractInventario.methods
      .verInventario(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

    var nombres_items = await this.props.wallet.contractInventario.methods
      .verItemsMarket()
      .call({ from: this.props.currentAccount });

      var inventario = []

    for (let index = 0; index < result.length; index++) {

        inventario[index] = (

          <div className="col-md-3 p-1" key={`itemsTeam-${index}`}>
            <img className="pb-4" src={"assets/img/" + nombres_items[0][index] + ".png"} width="100%" alt={"team-"+nombres_items[0][index]} />
          </div>

        )
    }

    this.setState({
      inventario: inventario
    })
  }

  render() {
    return (
      <><header className="masthead text-center ">
      <div className="masthead-content">
        <div className="container px-5">
        <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center bg-secondary bg-gradient text-white">
              <h2 className=" pb-4">CSC available:</h2><br></br>
              <h3 className=" pb-4">{this.state.balance}</h3>
            </div>

          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 p-4 text-center">
              <h2 className=" pb-4">Items</h2>
            </div>

            {this.state.itemsMarket}

          </div>
        </div>
      </div>
    </header>

      </>
    );
  }
}
