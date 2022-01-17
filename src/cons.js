import {APP_CSRK, APP_TOKNN} from "@env";

const proxy = "";

const PRE = "";

const WS = true;  //TESTNET

const TokenTest = "0x038987095f309d3640F51644430dc6C7C4E2E409"; //token de pruebas
const SCtest = "0xfF7009EF7eF85447F6A5b3f835C81ADd60a321C9";// contrato test market
const SC2test = "0xC4cC639697DBA2802386386279927C5b894Ec7a7";// contrado test fan youtuber
const SC3test = "0xebCC8F716087B6Bd4AF31759B8F7041ebEC5E820";// contrado test Staking

const SC4 = "0xe5578751439d52cf9958c4cf1A91eeb3b11F854C";// direccion del contrato Faucet Testent

const TOKEN = "0xF0fB4a5ACf1B1126A991ee189408b112028D7A63";
const SC = "0x2846df5d668C1B4017562b7d2C1E471373912509";// direccion del contrato Market
const SC2 = "0xbA5ff42070bF60fB307e643b3e458F76E84293Db";// direccion del contrato MyFans
const SC3 = "0x99dB6D082E5abD682dC8F4791F10FB39Bc334a9c";// direccion del contrato Staking

const SCK = APP_CSRK;
const SCKDTT = APP_TOKNN;

const API = "https://crypto-soccer-testnet.herokuapp.com/";

const WALLETPAY = "0x306A75c3E33603f69F4178C2c40EAF0734DE4F64";
const FACTOR_GAS = 2;


export default {WALLETPAY,FACTOR_GAS, proxy, WS, SCtest, SC2test, SC3test, TokenTest, SC, SC2, SC3, SC4, PRE, TOKEN, SCK, SCKDTT, API};
