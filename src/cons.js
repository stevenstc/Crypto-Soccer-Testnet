var TOKEN = "0xF0fB4a5ACf1B1126A991ee189408b112028D7A63";
var SC = "0x2846df5d668C1B4017562b7d2C1E471373912509";// Market
var SC2 = "0xbA5ff42070bF60fB307e643b3e458F76E84293Db";// MyFans
var SC3 = "0x99dB6D082E5abD682dC8F4791F10FB39Bc334a9c";// Staking

const SC4 = "0xe5578751439d52cf9958c4cf1A91eeb3b11F854C";// Faucet Testent

var SC5 = "0x16Da4914542574F953b31688f20f1544d4E89537";// Inventario
var SC6 = "0x907c4eADcd829Eff4084E6615bf6651938DE56C6";// Exchange


var chainId = '0x38';

var SCK = process.env.APP_CSRK;
var SCKDTT = process.env.APP_TOKNN;

var API = "https://brutustronstaking.tk/csc/";

var WALLETPAY = "0x00326ad2E5ADb9b95035737fD4c56aE452C2c965";

const TESTNET = true; 

if(TESTNET){
    TOKEN = "0x038987095f309d3640F51644430dc6C7C4E2E409"; //token de pruebas
    SC = "0xCB553b2128fAb586E8C6601983cdb134eaBdd989";//"0xfF7009EF7eF85447F6A5b3f835C81ADd60a321C9";// contrato test market
    SC2 = "0xC4cC639697DBA2802386386279927C5b894Ec7a7";// contrado test fan youtuber
    SC3 = "0xebCC8F716087B6Bd4AF31759B8F7041ebEC5E820";// contrado test Staking
    SC5 = "0xEeAB65c0e3076985E2aDBd8119D8e5B4784185c5"; // Inventario
    SC6 = "0x082621b836f5212731Ea2c6849f4D91813169B72"; // Exchange
    chainId = '0x61';
    API = "https://brutustronstaking.tk/csc-testnet/";
    WALLETPAY = "0x0c4c6519E8B6e4D9c99b09a3Cda475638c930b00";
}

const FACTOR_GAS = 3;

export default {WALLETPAY, FACTOR_GAS, SC, SC2, SC3, SC4, SC5, SC6, TOKEN, SCK, SCKDTT, API, chainId};
