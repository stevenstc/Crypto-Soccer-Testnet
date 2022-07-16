import React, { Component } from "react";
import cons from "../../cons"
const BigNumber = require('bignumber.js');

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
      botonwit: true,
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
      imagenLink: "assets/img/default-user-csg.png",
      balanceExchange: "loading..."
    }

    this.balance = this.balance.bind(this);
    this.balanceInMarket = this.balanceInMarket.bind(this);
    this.balanceInGame = this.balanceInGame.bind(this);
    this.inventario = this.inventario.bind(this);
    this.inventarioV2 = this.inventarioV2.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.update = this.update.bind(this);

  }

  async componentDidMount() {

    this.update();
    
    /*setInterval(async() => {
      this.update();
    },15*1000);*/
    
  }

  async update() {
    this.balanceInGame();
    this.balance();
    this.balanceInMarket();
    this.inventario();
    this.inventarioV2();

    
  }

  async balance() {
    var balance = await this.props.wallet.contractToken.methods
        .balanceOf(this.props.currentAccount)
        .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).toString(10);

    //console.log(balance)

    this.setState({
      balance: balance
    });
  }

  async updateEmail() {
    var email = "example@gmail.com";
    email = await window.prompt("enter your email", "example@gmail.com");

    var disponible = await fetch(cons.API+"api/v1/email/disponible/?email="+email);
    disponible = await disponible.text();

    if( disponible === "false" ){
      alert("email not available");
      return;
    }

    if(window.confirm("is correct?: "+email)){
 
      this.setState({
        email: email
      })
      
      var datos = {};
      
      datos.email = email;
        
      disponible = await fetch(cons.API+"api/v1/email/disponible/?email="+datos.email);
      disponible = await disponible.text();

      if( disponible === "false" ){
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
        });
        
        if(await resultado.text() === "true"){
          alert("Updated game data")
        }else{
          alert("failed to write game data")
        }
      }

      this.update();

      alert("email Updated");

    }

    this.update();
    
  }

  async balanceInMarket() {
    var investor = await this.props.wallet.contractExchange.methods
    .investors(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    var balance = investor.balance;
  
    balance = new BigNumber(balance).shiftedBy(-18).toString(10);

    //console.log(balance)

    var resultado = await fetch(cons.API+"api/v1/consultar/csc/cuenta/"+this.props.wallet.contractExchange._address)
    resultado = await resultado.text()
    resultado = parseFloat(resultado)

    this.setState({
      balanceMarket: balance,
      balanceExchange: resultado
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
    register = await register.text();

    if(register === "true"){

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
      .allowance(this.props.currentAccount, this.props.wallet.contractExchange._address)
      .call({ from: this.props.currentAccount });

    aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber();

    var balance = await this.props.wallet.contractToken.methods
    .balanceOf(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    balance = new BigNumber(balance).shiftedBy(-18).decimalPlaces(2).toNumber();

    var compra = amount+"000000000000000000";
    amount = new BigNumber(amount).decimalPlaces(2).toNumber();

    if(aprovado > 0){

      if (balance>=amount) {

        var result = await this.props.wallet.contractExchange.methods
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
      .approve(this.props.wallet.contractExchange._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
      .send({ from: this.props.currentAccount });

    }

    this.update();

    
  }

  async inventario() {

    var result = await this.props.wallet.contractInventario.methods
    .verInventario(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    var nombres_items = await this.props.wallet.contractInventario.methods
    .verItemsMarket()
    .call({ from: this.props.currentAccount });


    if(result.length > 0){

      var inventario = []

      for (let index = 0; index < result.length; index++) {

          inventario[index] = (

            <div className="col-md-3 p-1" key={`itemsTeam-${index}`}>
              <img className="pb-4" src={"assets/img/" + nombres_items[0][result[index]] + ".png"} width="100%" alt={"team-"+nombres_items[0][result[index]]} />
              <button className="btn btn-danger" onClick={async()=>{

                var aprovado = await this.props.wallet.contractToken.methods
                .allowance(this.props.currentAccount, this.props.wallet.contractInventario._address)
                .call({ from: this.props.currentAccount });

                aprovado = new BigNumber(aprovado).shiftedBy(-18).decimalPlaces(2).toNumber();

                if(aprovado <= 0){

                  alert("insuficient aproved balance")
                  await this.props.wallet.contractToken.methods
                  .approve(this.props.wallet.contractInventario._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
                  .send({ from: this.props.currentAccount });

                }


                var price = prompt("set price",5000)
                price = new BigNumber(price).shiftedBy(18).toString(10);
                await this.props.wallet.contractInventario.methods
                .SellItemFromMarket( index,this.props.wallet.contractToken._address, price)
                .send({ from: this.props.currentAccount })
                this.update();
                }}>Sell item</button>
            </div>

          )
      }

    }else{

      var largoInventario = await this.props.wallet.contractMarket.methods
      .largoInventario(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

      var migrado = await this.props.wallet.contractInventario.methods
      .migrado(this.props.currentAccount)
      .call({ from: this.props.currentAccount });

      if(largoInventario > 0 && !migrado){

        var old_inventario = [];

        for (let index = 0; index < largoInventario; index++) {
          const temp = await this.props.wallet.contractMarket.methods
          .inventario(this.props.currentAccount,index)
          .call({ from: this.props.currentAccount });

          if(nombres_items[0].indexOf(temp.nombre) !== -1){
            old_inventario[index] = nombres_items[0].indexOf(temp.nombre);  

          }

        }

        inventario = (
          <><button className="btn btn-warning" onClick={async()=>{
            if(old_inventario.length > 0){
              await this.props.wallet.contractInventario.methods
              .migrar(old_inventario)
              .send({ from: this.props.currentAccount });

            }else{
              alert("try again latter");
            }
            this.update();
            
        }}>Migrate teams to V2</button>
          </>
        )
      }
     
    }

    this.setState({
      inventario: inventario
    })
  }

  async inventarioV2() {

    var result = await this.props.wallet.contractInventario.methods
    .verMarket(this.props.currentAccount)
    .call({ from: this.props.currentAccount });

    var nombres_items = await this.props.wallet.contractInventario.methods
    .verItemsMarket()
    .call({ from: this.props.currentAccount });

    var inventario = []

    for (let index = 0; index < result[0].length; index++) {

        inventario[index] = (

          <div className="col-md-3 p-1" key={`itemsTeam-${index}`}>
            <img className="pb-4" src={"assets/img/" + nombres_items[0][result[0][index]] + ".png"} width="100%" alt={"team-"+nombres_items[0][result[0][index]]} />
            <p>Price: {new BigNumber(result[1][index]).shiftedBy(-18).toString(10)} CSC</p>
            <button className="btn btn-warning" onClick={async()=>{
              
              await this.props.wallet.contractInventario.methods
              .buyItemFromMarket(this.props.currentAccount, index)
              .send({ from: this.props.currentAccount });

              this.update();
            }}>Back to inventory</button>
          </div>

        )
    }

    this.setState({
      inventarioV2: inventario
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
      <br />
              <button
                className="btn btn-info"
                
                onClick={async() => {

                  var datos = {};
                  var tx = {};
                  tx.status = false;
                  var code = await prompt("Set your password",parseInt((Math.random())*100000000))//parseInt((Math.random())*100000000);
                  datos.password = code;

                  if(datos.password.length < 8){
                    alert("minimum 8 characters")
                    return;
                  }

                  if(true){

                    tx = await this.props.wallet.web3.eth.sendTransaction({
                      from: this.props.currentAccount,
                      to: cons.WALLETPAY,
                      value: 20000+"0000000000"
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

                    resultado = await resultado.text();
                    
                    if(resultado === "true"){

                      datos = {};
                      datos.token =  cons.SCKDTT;
                      var emailGame = await fetch(cons.API+"api/v1/user/email/"+this.props.currentAccount+"?tokenemail=nuevo123");
                      emailGame = await emailGame.text();

                      if(emailGame === "false"){
                        alert("wrong email");
                        return;
                      }else{
                        datos.destino = emailGame+"";
                        datos.code = code+"";

                      fetch(cons.API+"api/v1/sendmail",
                      {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                          'Content-Type': 'application/json'
                          // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: JSON.stringify(datos) // body data type must match "Content-Type" header
                      }).then(()=>{
                        alert("PIN sended to "+ emailGame)
                      }).catch(()=>{
                        alert("fail send pin")
                      })
                      }
                      

                    }else{
                      alert("failed")
                    }
                  }

                  this.update()
                }}
              >
                Set new password
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
          disponible = await disponible.text();

          if( disponible === "false"){
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
            disponible = await disponible.text();
            if( disponible === "false" ){
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

            resultado = await resultado.text();

            if(resultado === "true"){
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

      <div className="site-section pt-0 feature-blocks-1" data-aos="fade" data-aos-delay="100">
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-lg-4" >
                  <div className="p-3 p-md-5 feature-block-1 mb-5 mb-lg-0 bg" style={{"backgroundImage": "url('assets/img/01.png')"}}>
                    <div className="text">
                      <h2 className="h5 text-white">100 WCSC</h2>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos repellat autem illum nostrum sit distinctio!</p>
                      <p className="mb-0" onClick={() => this.buyCoins(100)}><button className="btn btn-primary btn-sm px-4 py-2 rounded-0">Buy</button></p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="p-3 p-md-5 feature-block-1 mb-5 mb-lg-0 bg" style={{"backgroundImage": "url('assets/img/02.png')"}}>
                    <div className="text">
                      <h2 className="h5 text-white">500 WCSC</h2>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos repellat autem illum nostrum sit distinctio!</p>
                      <p className="mb-0" onClick={() => this.buyCoins(500)}><button className="btn btn-primary btn-sm px-4 py-2 rounded-0">Buy</button></p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="p-3 p-md-5 feature-block-1 mb-5 mb-lg-0 bg" style={{"backgroundImage": "url('assets/img/03.png')"}}>
                    <div className="text">
                      <h2 className="h5 text-white">1000 WCSC</h2>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos repellat autem illum nostrum sit distinctio!</p>
                      <p className="mb-0" onClick={() => this.buyCoins(1000)}><button className="btn btn-primary btn-sm px-4 py-2 rounded-0">Buy</button></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div className="container mt-3 mb-3">
          <div className="row text-center">
            <div className="col-lg-6 col-md-6 ">
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

            <div className="col-lg-6 col-md-6">

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
                disponible = await disponible.text();

                if( disponible === "false"){
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
            <hr></hr>
              <span>
                CSC: {this.state.balance}
              </span>
              <br/><br/>
              
              <button
                className="btn btn-success"
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
            
            <a href="https://bscscan.com/address/0x2846df5d668C1B4017562b7d2C1E471373912509#tokentxns"><img
                src="assets/favicon.ico"
                className="meta-gray"
                width="100"
                height="100" 
                alt="markert info"/></a>

            <h3>EXCHANGE <br></br>{this.state.balanceExchange +" CSC"}</h3>
            <hr></hr>
              <span title={"liquidity"}>
                WCSC: {this.state.balanceMarket}
              </span>
              <br/><br/>
              <button
                className="btn btn-primary"
                onClick={async() => 
                { 

                  var resultado = await fetch(cons.API+"api/v1/consultar/csc/cuenta/"+this.props.wallet.contractExchange._address);
                  resultado = await resultado.text();

                  var cantidad = await prompt("Enter the amount of coins to withdraw to your wallet");

                  if(parseInt(cantidad) > parseInt(resultado) ){
                    alert("Please try again later")
                    return;
                  }

                  if(parseInt(this.state.balanceMarket) > 0 && parseInt(this.state.balanceMarket)-parseInt(cantidad) >= 0 && parseInt(cantidad) >= 100 && parseInt(cantidad)<= 5000){
                    
                    this.setState({
                      balanceMarket: parseInt(this.state.balanceMarket)-parseInt(cantidad)
                    })

                    var result = await this.props.wallet.contractExchange.methods
                    .sellCoins(cantidad+"000000000000000000")
                    .send({ from: this.props.currentAccount });

                    alert("your hash transaction: "+result.transactionHash);

                  }else{
                    if(parseInt(cantidad) < 500){
                      alert("Please set amount greater than 500 WCSC");
                    }

                    if(parseInt(cantidad) > 5000){
                      alert("Set an amount less than 5000 WCSC");
                    }

                    if(parseInt(this.state.balanceMarket) <= 0){
                      alert("Insufficient Funds");
                    }
                  }

                  this.update();

                }}
              >
                {"<- "}
                Sell WCSC
              </button>
              <br/><br/>
              <button
                className="btn btn-success"
                onClick={async() => {

                  var tx = {};
                  tx.status = false;

                  var cantidad = await prompt("Enter the amount of coins to withdraw to GAME");

                  var gasLimit = await this.props.wallet.contractExchange.methods.gastarCoinsfrom(cantidad+"000000000000000000",  this.props.currentAccount).estimateGas({from: cons.WALLETPAY});
                  
                  gasLimit = gasLimit*cons.FACTOR_GAS;

                  var usuario = await this.props.wallet.contractExchange.methods.investors(this.props.currentAccount).call({from: this.props.currentAccount});
                  var balance = new BigNumber(usuario.balance);
                  balance = balance.minus(usuario.gastado);
                  balance = balance.shiftedBy(-18);
                  balance = balance.decimalPlaces(0).toNumber();

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
            <hr></hr>
              <span>
                WCSC: {this.state.balanceGAME}
              </span>
             
              <br/><br/>
              <button
                className="btn btn-primary"
                onClick={async() => {

                  if(this.state.botonwit){
                    this.setState({
                      botonwit: false
                    })

                    var tx = {};
                    tx.status = false;

                    var cantidad = await prompt("Enter the amount of coins to withdraw to EXCHANGE","500");
                    cantidad = parseInt(cantidad);

                    var timeWitdrwal = await fetch(cons.API+"api/v1/time/coinsalmarket/"+this.props.currentAccount);
                    timeWitdrwal =  parseInt(await timeWitdrwal.text());

                    if(Date.now() >= timeWitdrwal && this.state.balanceGAME-cantidad >= 0 && cantidad >= 500 && cantidad <= 5000){

                      this.setState({
                        balanceInGame: this.state.balanceGAME-cantidad
                      })
                    
                      var gasLimit = await this.props.wallet.contractExchange.methods.asignarCoinsTo(cantidad+"000000000000000000",  this.props.currentAccount).estimateGas({from: cons.WALLETPAY});
                      
                      gasLimit = gasLimit*cons.FACTOR_GAS;

                        tx = await this.props.wallet.web3.eth.sendTransaction({
                          from: this.props.currentAccount,
                          to: cons.WALLETPAY,
                          value: gasLimit+"0000000000"
                        })

                        console.log(tx.status);
                        
                        if(tx.status ){

                          var resultado = await fetch(cons.API+"api/v1/coinsalmarket/"+this.props.currentAccount,
                          {
                            method: 'POST', // *GET, POST, PUT, DELETE, etc.
                            headers: {
                              'Content-Type': 'application/json'
                              // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: JSON.stringify({token: cons.SCKDTT, coins: cantidad}) // body data type must match "Content-Type" header
                          })

                          resultado = await resultado.text();
    
                          if(resultado === "true"){
                            alert("Coins send to EXCHANGE")
                            
                          }else{
                            alert("send to EXCHANGE failed")
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
                    this.setState({
                      botonwit: true
                    })
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
              <h3>Inventory</h3>{" "}
              
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
              <h3>Market for sell</h3>
              <h3>link: <a id="id_elemento" href={document.location+"?market-v2="+this.props.currentAccount}>{document.location+"?market-v2="+this.props.currentAccount}</a></h3>
              <button className="btn btn-info" onClick={()=>{
                 var aux = document.createElement("input");
                 aux.setAttribute("value", document.getElementById("id_elemento").innerHTML);
                 document.body.appendChild(aux);
                 aux.select();
                 document.execCommand("copy");
                 document.body.removeChild(aux);
                 alert("Copied!")
              }}> Copy </button>
              
            </div>
          </div>

          <div className="row text-center" id="inventory">
            {this.state.inventarioV2}
          </div>

        </div>
      </>
    );
  }
}
