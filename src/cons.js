var TOKEN = "0xF0fB4a5ACf1B1126A991ee189408b112028D7A63";
var SC = "0x2846df5d668C1B4017562b7d2C1E471373912509";// Market
var SC2 = "0xbA5ff42070bF60fB307e643b3e458F76E84293Db";// MyFans
var SC3 = "0x99dB6D082E5abD682dC8F4791F10FB39Bc334a9c";// Staking

const SC4 = "0xe5578751439d52cf9958c4cf1A91eeb3b11F854C";// Faucet Testent

var SC5 = "0x99dB6D082E5abD682dC8F4791F10FB39Bc334a9c";// Market V2
var SC6 = "0xf0218bbd50ddf065b7a43862fd9e27ee1925c050";// Token NFT


var chainId = '0x38';

var SCK = process.env.APP_CSRK;
var SCKDTT = process.env.APP_TOKNN;

var API = "https://brutustronstaking.tk/csc/";

var WALLETPAY = "0x00326ad2E5ADb9b95035737fD4c56aE452C2c965";

const TESTNET = true; 

if(TESTNET){
    TOKEN = "0x038987095f309d3640F51644430dc6C7C4E2E409"; //token de pruebas
    SC = "0xD4e1471f52Db95BdD68CCBdA7c603822AF5f54fb";// contrato test market
    SC2 = "0xC4cC639697DBA2802386386279927C5b894Ec7a7";// contrado test fan youtuber
    SC3 = "0xebCC8F716087B6Bd4AF31759B8F7041ebEC5E820";// contrado test Staking
    SC5 = "0x99dB6D082E5abD682dC8F4791F10FB39Bc334a9c"; // Market V2
    SC6 = "0xf0218bbd50ddf065b7a43862fd9e27ee1925c050"; // NFT
    chainId = '0x61';
    API = "https://brutustronstaking.tk/csc-testnet/";
    WALLETPAY = "0x0c4c6519E8B6e4D9c99b09a3Cda475638c930b00";
}

const FACTOR_GAS = 3;

export default {WALLETPAY, FACTOR_GAS, SC, SC2, SC3, SC4, SC5, SC6, TOKEN, SCK, SCKDTT, API, chainId};
