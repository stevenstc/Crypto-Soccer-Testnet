import React, { Component } from "react";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
 
    }
  }

  render() {

    return (
      <>

        <div className="container mt-5 mb-3" style={{'paddingTop': '7em'}}>
          <div className="row text-center">
            <div className="col-lg-12 col-md-12 ">
              <h2>Wallet conected</h2>
              <p>{this.props.currentAccount}<br></br>
              <button
                className="btn btn-success"
                onClick={() => {

                  window.ethereum.request({
                  method: 'wallet_watchAsset',
                  params: {
                    type: 'ERC20',
                    options: {
                      address: this.props.wallet.contractToken._address,
                      symbol: 'CSC',
                      decimals: 18,
                      image: 'https://cryptosoccermarket.com/assets/img/coin.png',
                    },
                  },
                })
                  .then((success) => {
                    if (success) {
                      console.log('CSC successfully added to wallet!')
                    } else {
                      throw new Error('Something went wrong.')
                    }
                  })
                  .catch(console.error)}
                }>
               <i className="fas fa-plus-square"></i> Add CSC token to metamask
              </button>
                <br/><br/>
                <button
                className="btn btn-warning"
                onClick={() => {

                  this.props.wallet.contractFaucet.methods
                  .claim()
                  .send({ from: this.props.currentAccount })
                  .then(()=>{console.log("Claimed")})

                  window.ethereum.request({
                  method: 'wallet_watchAsset',
                  params: {
                    type: 'ERC20',
                    options: {
                      address: this.props.wallet.contractToken._address,
                      symbol: 'CSC',
                      decimals: 18,
                      image: 'https://cryptosoccermarket.com/assets/img/coin.png',
                    },
                  },
                })
                  .then((success) => {
                    if (success) {
                      console.log('CSC successfully added to wallet!')
                    } else {
                      throw new Error('Something went wrong.')
                    }
                  })
                  .catch(console.error)}
                }>
                CLAIM CSC
              </button>
              </p>
            </div>
          </div>

        </div>
      </>
    );
  }

}