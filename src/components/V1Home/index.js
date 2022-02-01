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
      balanceGAME: "Loading...",
      email: "Loading...",
      username: "Loading...",
      register: false,
      pais: "country not selected",
      timeWitdrwal: "Loading...",
      paises:[
        "please select a country",
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cape Verde",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Comoros",
        "Congo (Brazzaville)",
        "Congo",
        "Costa Rica",
        "Cote d'Ivoire",
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "East Timor (Timor Timur)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Fiji",
        "Finland",
        "France",
        "Gabon",
        "Gambia, The",
        "Georgia",
        "Germany",
        "Ghana",
        "Greece",
        "Grenada",
        "Guatemala",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Honduras",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea, North",
        "Korea, South",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepa",
        "Netherlands",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia and Montenegro",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Togo",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Vatican City",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Zambia",
        "Zimbabwe"
      ],
      imagenLink: "assets/img/default-user-csg.png"
    }

    this.balance = this.balance.bind(this);
    this.balanceInMarket = this.balanceInMarket.bind(this);
    this.balanceInGame = this.balanceInGame.bind(this);
    this.inventario = this.inventario.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.update = this.update.bind(this);

  }

  async componentDidMount() {

    await this.update();
    /*

    setInterval(async() => {
      this.balanceInGame();
      this.balanceInMarket();
    },7*1000);*/
    
  }

  async update() {
     this.balanceInGame();
     this.balance();
     this.balanceInMarket();
     this.inventario();
    
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


    var disponible = await fetch(cons.API+"api/v1/email/disponible/?email="+email);
    disponible = Boolean(await disponible.text());

    if( !disponible ){
      alert("email not available");
      return;
    }

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

      this.setState({
        email: email
      })

      
      var datos = {};
      
        datos.email = email;
        
        disponible = await fetch(cons.API+"api/v1/email/disponible/?email="+datos.email);
        disponible = Boolean(await disponible.text());
        if( !disponible ){
          alert("email not available please select a different one");
          return;
        }else{
        
        datos.token =  cons.SCKDTT;
        
        var resultado = await fetch(cons.API+"api/v1/user/update/info/"+this.props.currentAccount,
        {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(datos) // body data type must match "Content-Type" header
        })
        
        if(await resultado.text() === "true"){
          alert("Updated game data")
        }else{
          alert("failed to write game data")
        }
      }

      this.update()

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

    //console.log(email.length);


    if (email === "" || email.length < 100) {
      email = "Please update your email";
    }else{
      email = cryptr.decrypt(investor.correo)
      
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

  async balanceInGame(){

    var balance = 0;
    var username = "Please register";
    var emailGame = "email game not set";
    var pais =  "country not selected";
    var timeWitdrwal = "Loading...";
    var imagenLink = "assets/img/default-user-csg.png";

    var register = await fetch(cons.API+"api/v1/user/exist/"+this.props.currentAccount);
    register = Boolean(await register.text());

    if(register){

      username = await fetch(cons.API+"api/v1/user/username/"+this.props.currentAccount);
      username = await username.text();

      imagenLink = await fetch(cons.API+"api/v1/imagen/user/?username="+username);
      imagenLink = await imagenLink.text();

      document.getElementById("username").innerHTML = username;

      pais = await fetch(cons.API+"api/v1/user/pais/"+this.props.currentAccount);
      pais = await pais.text();

      balance = await fetch(cons.API+"api/v1/coins/"+this.props.currentAccount)
      balance = await balance.text();

      emailGame = await fetch(cons.API+"api/v1/user/email/"+this.props.currentAccount+"?tokenemail=nuevo123");
      emailGame = await emailGame.text();

      timeWitdrwal = await fetch(cons.API+"api/v1/time/coinsalmarket/"+this.props.currentAccount);
      timeWitdrwal = await timeWitdrwal.text();

    }

    if(username === ""){
      username = "Please register"
      register = false;
    }

    if(emailGame === "false" || emailGame === ""){
      emailGame = "email game not set";
    }

    if(pais === "false" || pais === "" ){
      pais = "country not selected";
    }


    this.setState({
      balanceGAME: balance,
      username: username,
      register: register,
      emailGame: emailGame,
      pais: pais,
      timeWitdrwal: new Date(parseInt(timeWitdrwal)).toString(),
      imagenLink: imagenLink
    });
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
    compra = amount+"000000000000000000";
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

          <div className="col-lg-3 col-md-6 p-1" key={`itemsTeam-${index}`}>
            <img className="pb-4" src={"assets/img/" + item.nombre + ".png"} width="100%" alt={"team "+item.nombre} />
          </div>

        )
    }

    this.setState({
      inventario: inventario
    })
  }

  render() {

    var syncEmail = (<>
              <button
                className="btn btn-info"
                onClick={async() => {

                  var datos = {};
                  
                  if( this.state.email === "" || this.state.email === "Please update your email"|| this.state.email === "Loading..." || this.state.email === "loading...") {
                    alert("please try again")
                    return;
                  }else{
                    datos.email = this.state.email;
                  }


                  if(true){
                    
                    datos.token =  cons.SCKDTT;
                    
                    var resultado = await fetch(cons.API+"api/v1/user/update/info/"+this.props.currentAccount,
                    {
                      method: 'POST', // *GET, POST, PUT, DELETE, etc.
                      headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: JSON.stringify(datos) // body data type must match "Content-Type" header
                    })
                    
                    if(await resultado.text() === "true"){
                      alert("Email Updated")
                    }else{
                      alert("failed")
                    }
                  }
                  this.setState({
                    emailGame: this.state.email
                  })

                  this.update();
                }}
              >
                <i className="fas fa-sync"></i> sync email to game
              </button>
              <br></br>
    </>)

    if(this.state.emailGame !== "email game not set"){
      syncEmail = (<></>);
    }

    var botonReg = (<>
    {syncEmail}
       <form>
        <input id="pass" onMouseLeave={()=>{document.getElementById("pass").type="password"}} onMouseOver={()=>{document.getElementById("pass").type="text"}} type={"password"} autoComplete="new-password" placeholder="***********"></input>  
      </form>{" "} <br />
              <button
                className="btn btn-info"
                
                onClick={async() => {

                  var datos = {};
                  var tx = {};
                  tx.status = false;
                  datos.password = document.getElementById("pass").value;

                    if(datos.password.length < 8){
                      alert("Please enter a password with a minimum length of 8 characters.");
                      document.getElementById("pass").value = "";
                      return;
                    }else{

                      tx = await this.props.wallet.web3.eth.sendTransaction({
                        from: this.props.currentAccount,
                        to: cons.WALLETPAY,
                        value: 20000+"0000000000"
                      })


                    }

                  console.log(tx.status)

                  if(tx.status){
                    
                    datos.token =  cons.SCKDTT;
                    
                    var resultado = await fetch(cons.API+"api/v1/user/update/info/"+this.props.currentAccount,
                    {
                      method: 'POST', // *GET, POST, PUT, DELETE, etc.
                      headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: JSON.stringify(datos) // body data type must match "Content-Type" header
                    })
                    
                    if(await resultado.text() === "true"){
                      alert("Password Updated")
                    }else{
                      alert("failed")
                    }
                  }

                  this.update()
                }}
              >
                Change Password
              </button>
    </>);

    if(!this.state.register){

      var options = [];

      for (let index = 1; index < this.state.paises.length; index++) {
        options[index] = (<option value={this.state.paises[index]} key={"opt"+index}>{this.state.paises[index]}</option>);

      }

    botonReg = (<>

    <select name="pais" id="pais">
      <option value="null" defaultValue>{this.state.paises[0]}</option>
      {options}
    </select>
    <br />
    <button
        className="btn btn-info"
        onClick={async() => {

          var datos = {};
          var tx = {};
          tx.status = false;

          
          datos.username = await prompt("please set a username for the game:")
          var disponible = await fetch(cons.API+"api/v1/username/disponible/?username="+datos.username);
          disponible = Boolean(await disponible.text());
          if( !disponible ){
            alert("username not available");
            return;
          }
          
          datos.password = await prompt("Please enter a password with a minimum length of 8 characters:");
          
            if(datos.password.length < 8){
              alert("Please enter a password with a minimum length of 8 characters.")
              return;
            }

            if(document.getElementById("pais").value === "null"){
              alert("Please select a country");
              return;
            }
            datos.pais = document.getElementById("pais").value;

            if( this.state.email === "" || this.state.email === "Please update your email" || this.state.email === "Loading..." || this.state.email === "loading...") {
              datos.email = await prompt("Please enter your email:");
            }else{
              datos.email = this.state.email;
            }
            disponible = await fetch(cons.API+"api/v1/email/disponible/?email="+datos.email);
            disponible = Boolean(await disponible.text());
            if( !disponible ){
              alert("email not available");
              return;
            }

            if(await window.confirm("you want profile image?")){
              datos.imagen = await prompt("Place a profile image link in jpg jpeg or png format, we recommend that it be 500 X 500 pixels","https://cryptosoccermarket.com/assets/img/default-user-csg.png");
            
            }else{
              datos.imagen = "https://cryptosoccermarket.com/assets/img/default-user-csg.png";
            }


            tx = await this.props.wallet.web3.eth.sendTransaction({
              from: this.props.currentAccount,
              to: cons.WALLETPAY,
              value: 30000+"0000000000"
            }) 
            

          if(tx.status){
            
            datos.token =  cons.SCKDTT;
            
            var resultado = await fetch(cons.API+"api/v1/user/update/info/"+this.props.currentAccount,
            {
              method: 'POST', // *GET, POST, PUT, DELETE, etc.
              headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify(datos) // body data type must match "Content-Type" header
            })
            
            if(await resultado.text() === "true"){
              alert("Updated record")
            }else{
              alert("failed")
            }
          }

          this.update()
        }}
      >
        Register
      </button>

      </>
      
      );

    }


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
                  <h2 className=" pb-4">100 WCSC</h2>
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
                      BUY
                    </span>
                  </div>
                </div>

                <div 
                  className="col-lg-4 col-md-12 p-4 monedas"
                  onClick={() => this.buyCoins(500)}
                
                >
                  
                  <h2 className=" pb-4">500 WCSC</h2>
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
                      BUY
                    </span>
                  </div>
                </div>

                <div 
                  className="col-lg-4 col-md-12 p-4 monedas"
                  onClick={() => this.buyCoins(1000)}
                >
                  <h2 className=" pb-4">1000 WCSC</h2>
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
                      BUY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mt-3 mb-3">
          <div className="row text-center">
            <div className="col-lg-4 col-md-4 ">
              <h2>Wallet conected</h2>
              <p>{this.props.currentAccount}</p>
              <p>
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
                      console.log('FOO successfully added to wallet!')
                    } else {
                      throw new Error('Something went wrong.')
                    }
                  })
                  .catch(console.error)}
                }>
               <i className="fas fa-plus-square"></i> Add CSC token to metamask
              </button>
              </p>
              <button
                className="btn btn-success"
                onClick={() => this.update()}
              >
               <i className="fas fa-sync"></i> Refresh web page
              </button>
            </div>

            <div className="col-lg-4 col-md-4 ">

            <h2>Email Registred on Market</h2>
                {this.state.email}
              <br /><br />
              <button
                className="btn btn-secondary"
                onClick={() => this.updateEmail()}
              >
                <i className="fas fa-envelope-open-text"></i> Update Email
              </button>

             
            </div>

            <div className="col-lg-4 col-md-4">

            <h2>GAME data</h2>

            <img
                src={this.state.imagenLink}
                className="meta-gray"
                width="100"
                height="100" 
                alt={"user "+this.state.username}
                style={{cursor:"pointer"}}
                onClick={async() => {

                  var datos = {};
                  var tx = {};
                  tx.status = false;

                  if(await window.confirm("you want update profile image?")){
                    datos.imagen = await prompt("Place a profile image link in jpg jpeg or png format, we recommend that it be 500 X 500 pixels","https://cryptosoccermarket.com/assets/img/default-user-csg.png");
                    tx = await this.props.wallet.web3.eth.sendTransaction({
                      from: this.props.currentAccount,
                      to: cons.WALLETPAY,
                      value: 30000+"0000000000"
                    })
                  }                  

                  if(tx.status){
                    
                    datos.token =  cons.SCKDTT;
                    
                    var resultado = await fetch(cons.API+"api/v1/user/update/info/"+this.props.currentAccount,
                    {
                      method: 'POST', // *GET, POST, PUT, DELETE, etc.
                      headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: JSON.stringify(datos) // body data type must match "Content-Type" header
                    })
                    
                    if(await resultado.text() === "true"){
                      alert("image link Updated")
                    }else{
                      alert("failed")
                    }
                  }

                  this.update()
                }}
                />

                <br></br>

            <span id="username" onClick={async() => {

              var datos = {};
              var tx = {};
              tx.status = false;

datos.username = await prompt("please set a NEW username for the game:")
  var disponible = await fetch(cons.API+"api/v1/username/disponible/?username="+datos.username);
  disponible = Boolean(await disponible.text());

  if( !disponible ){
    alert("username not available");
    return;
  }else{
    tx = await this.props.wallet.web3.eth.sendTransaction({
      from: this.props.currentAccount,
      to: cons.WALLETPAY,
      value: 80000+"0000000000"
    }) 
  }

if(tx.status){
  
  datos.token =  cons.SCKDTT;
  
  var resultado = await fetch(cons.API+"api/v1/user/update/info/"+this.props.currentAccount,
  {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(datos) // body data type must match "Content-Type" header
  })
  
  if(await resultado.text() === "true"){
    alert("username Updated")
  }else{
    alert("failed")
  }
}
this.setState({
  username: this.state.email
})

this.update();
}} style={{cursor:"pointer"}}> Username: {this.state.username}</span> | {this.state.pais} | {this.state.emailGame}
              <br /><br />

              {botonReg}
              
            </div>

          </div>
          <hr></hr>
          <div className="row text-center">
          
            <div className="col-lg-4 col-md-12 mt-2">
            <img
                src="assets/favicon.ico"
                className="meta-gray"
                width="100"
                height="100" 
                alt="markert info"/>

            <h3>MARKET</h3>
              <span>
                CSC: {this.state.balance}
              </span>
              <br/><br/>
              
              <button
                className="btn btn-primary"
                onClick={async() => 
                { 
                  
                  var cantidad = await prompt("Enter the amount of coins to send to EXCHANGE");

                  if(parseInt(cantidad) >= 100 ){
                    await this.buyCoins(cantidad);
                  }else{
                    alert("please enter valid amount");
                  }

                  this.update();

                }}
              >
                {" "}
                Buy WCSC {" -> "}
              </button>

            </div>

            <div className="col-lg-4 col-md-12  mt-2">
            <img
                src="assets/favicon.ico"
                className="meta-gray"
                width="100"
                height="100" 
                alt="markert info"/>

            <h3>EXCHANGE</h3>
              <span>
                WCSC: {this.state.balanceMarket}
              </span>
              <br/><br/>
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
                Sell WCSC
              </button>
              <br/><br/>
              <button
                className="btn btn-primary"
                onClick={async() => {

                  var tx = {};
                  tx.status = false;

                  var cantidad = await prompt("Enter the amount of coins to withdraw to GAME");

                  var gasLimit = await this.props.wallet.contractMarket.methods.gastarCoinsfrom(cantidad+"000000000000000000",  this.props.currentAccount).estimateGas({from: cons.WALLETPAY});
                  
                  gasLimit = gasLimit*cons.FACTOR_GAS;
                  console.log(gasLimit)

                  var usuario = await this.props.wallet.contractMarket.methods.investors(this.props.currentAccount).call({from: this.props.currentAccount});
                  var balance = new BigNumber(usuario.balance);
                  balance = balance.minus(usuario.gastado);
                  balance = balance.shiftedBy(-18);
                  balance = balance.decimalPlaces(0).toNumber();
                  console.log(balance)
                  console.log(parseInt(cantidad))

                  if(balance-parseInt(cantidad) >= 0){
                    tx = await this.props.wallet.web3.eth.sendTransaction({
                      from: this.props.currentAccount,
                      to: cons.WALLETPAY,
                      value: gasLimit+"0000000000"
                    })

                    if(tx.status)

                    var resultado = await fetch(cons.API+"api/v1/coinsaljuego/"+this.props.currentAccount,
                    {
                      method: 'POST', // *GET, POST, PUT, DELETE, etc.
                      headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: JSON.stringify({token: cons.SCKDTT, coins: cantidad}) // body data type must match "Content-Type" header
                    })
                    
                    if(await resultado.text() === "true"){
                      alert("Coins send to GAME")
                    }else{
                      alert("send failed")
                    }
                  }else{
                    alert("insuficient founds")
                  }
                  this.update()
                }}
              >
                {" "}
                Send WCSC To Game {" ->"}
              </button>
            </div>

            <div className="col-lg-4 col-md-12  mt-2">
            <img
                src="assets/favicon.ico"
                className="meta-gray"
                width="100"
                height="100" 
                alt="markert info"/>

            <h3>IN GAME</h3>
              <span>
                WCSC: {this.state.balanceGAME}
              </span>
             
              <br/><br/>
              <button
                className="btn btn-primary"
                onClick={async() => {

                  var tx = {};
                  tx.status = false;

                  var cantidad = await prompt("Enter the amount of coins to withdraw to EXCHANGE","500");
                  cantidad = parseInt(cantidad);

                  var timeWitdrwal = await fetch(cons.API+"api/v1/time/coinsalmarket/"+this.props.currentAccount);
                  timeWitdrwal = await timeWitdrwal.text();

                  timeWitdrwal = parseInt(timeWitdrwal);
                  console.log(Date.now())
                  console.log(timeWitdrwal)


                  if(Date.now() >= timeWitdrwal && this.state.balanceGAME-cantidad >= 0 && cantidad >= 500 && cantidad <= 10000){
                  
                    var gasLimit = await this.props.wallet.contractMarket.methods.asignarCoinsTo(cantidad+"000000000000000000",  this.props.currentAccount).estimateGas({from: cons.WALLETPAY});
                    
                    gasLimit = gasLimit*cons.FACTOR_GAS;

                    tx = await this.props.wallet.web3.eth.sendTransaction({
                      from: this.props.currentAccount,
                      to: cons.WALLETPAY,
                      value: gasLimit+"0000000000"
                    })


                    if(tx.status){

                      var resultado = await fetch(cons.API+"api/v1/coinsalmarket/"+this.props.currentAccount,
                      {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                          'Content-Type': 'application/json'
                          // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: JSON.stringify({token: cons.SCKDTT, coins: cantidad}) // body data type must match "Content-Type" header
                      })

                      if(await resultado.text() === "true"){
                        alert("Coins send to EXCHANGE")
                        this.setState({
                          balanceInGame: this.state.balanceGAME-cantidad
                        })
                        
                      }else{
                        alert("send failed")
                      }
                    }
                    this.update()
                  }else{
                    if(Date.now() >= timeWitdrwal){
                      if (this.state.balanceGAME-cantidad < 0) {
                        alert("Insufficient funds WCSC")
                      }else{
                        if(cantidad < 500 ){
                          alert("Please enter a value greater than 500 WCSC")
                        }else{
                          alert("Please enter a value less than 10000 WCSC")
                        }
                      }
                    }else{
                      alert("It is not yet time to withdraw")
                    }
                    
                  }
                }}
              >
                
                {" <-"} Withdraw To Exchange {" "}
              </button>
              <br /><br />

              Next Time to Witdrwal: {this.state.timeWitdrwal}

            </div>

            <div className="col-lg-12 col-md-12 text-center">
              <hr></hr>
            </div>

          </div>
          
          <div style={{ marginTop: "30px" }} className="row text-center">
            <div className="col-md-12">
              <h3>IN GAME inventory</h3>{" "}
              
            </div>
          </div>

          <div className="row text-center" id="inventory">
            {this.state.inventario}
          </div>

          <div className="col-lg-12 col-md-12 text-center">
              <hr></hr>
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
