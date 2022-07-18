pragma solidity >=0.8.0;
// SPDX-License-Identifier: Apache 2.0

interface TRC20_Interface {
  function allowance(address _owner, address _spender) external view returns (uint remaining);
  function transferFrom(address _from, address _to, uint _value) external returns (bool);
  function transfer(address direccion, uint cantidad) external returns (bool);
  function balanceOf(address who) external view returns (uint256);
  function decimals() external view returns(uint);
}

library SafeMath {

  function mul(uint a, uint b) internal pure returns (uint) {
    if (a == 0) {
      return 0;
    }

    uint c = a * b;
    require(c / a == b);

    return c;
  }

  function div(uint a, uint b) internal pure returns (uint) {
    require(b > 0);
    uint c = a / b;

    return c;
  }

  function sub(uint a, uint b) internal pure returns (uint) {
    require(b <= a);
    uint c = a - b;

    return c;
  }

  function add(uint a, uint b) internal pure returns (uint) {
    uint c = a + b;
    require(c >= a);

    return c;
  }

}

contract Ownable {
  address payable public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  constructor(){
    owner = payable(msg.sender);
  }

  modifier onlyOwner() {
    if(msg.sender != owner)revert();
    _;
  }

  function transferOwnership(address payable newOwner) public onlyOwner {
    if(newOwner == address(0))revert();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract Admin is Ownable{
  mapping (address => bool) public admin;

  event NewAdmin(address indexed admin);
  event AdminRemoved(address indexed admin);

  constructor(){
    admin[msg.sender] = true;
  }

  modifier onlyAdmin() {
    if(!admin[msg.sender])revert();
    _;
  }

  function makeNewAdmin(address payable _newadmin) public onlyOwner {
    require(_newadmin != address(0));
    emit NewAdmin(_newadmin);
    admin[_newadmin] = true;
  }

  function makeRemoveAdmin(address payable _oldadmin) public onlyOwner {
    require(_oldadmin != address(0));
    emit AdminRemoved(_oldadmin);
    admin[_oldadmin] = false;
  }

}

contract Inventario is Admin{
  using SafeMath for uint256;

  bool public migracion = true;
  bool public buyItems = true;
  bool public sellItems = true;

  address[] public WALLETS_FEE = [0x0c4c6519E8B6e4D9c99b09a3Cda475638c930b00,0x000000000000000000000000000000000000dEaD,0x004769eF6aec57EfBF56c24d0A04Fe619fBB6143];
  uint256[] public FEE_CSC = [100 * 10**18,100 * 10**18,100 * 10**18];
 
  address public token = 0xF0fB4a5ACf1B1126A991ee189408b112028D7A63;
  address public walletExchange = 0x907c4eADcd829Eff4084E6615bf6651938DE56C6;

  TRC20_Interface CSC_Contract = TRC20_Interface(token);
  TRC20_Interface OTRO_Contract = TRC20_Interface(token);
  
  mapping (address => bool) public migrado;
  mapping (address => bool) public baneado;
  mapping (address => uint256[]) public almacen;
  mapping (address => uint256[]) public market;
  mapping (address => address[]) public market_token;
  mapping (address => uint256[]) public market_price;

  string[] public items;
  bool[] public comprable;
  bool[] public imprimible;
  uint256[] public precio;
  

  constructor() {

    items = ["t1-brazil-legendario","t2-argentina-legendario","t3-alemania-legendario","t4-japon-epico","t5-colombia-epico","t6-mexico-epico","t7-croacia-epico","t8-EU-epico","t9-portugal-epico","t10-esp-epico","t11-argentina-comun","t12-australia-comun","t13-belgium-comun","t14-brazil-comun","t15-canda-comun","t16-colombia-comun","t17-costaRica-comun","t18-croatia-comun","t19-denmark-comun","t20-england-comun","t21-germany-comun","t22-holland-comun","t23-iceland-comun","t24-iran-comun","t25-italy-comun","t26-ivoryCoast-comun","t27-japan-comun","t28-koreaRepublic-comun","t29-mexico-comun","t30-panama-comun","t31-peru-comun","t32-poland-comun","t33-portugal-comun","t34-russia-comun","t35-senegal-comun","t36-serbia-comun","t37-spain-comun","t38-sweden-comun","t39-switzerland-comun","t40-tunisia-comun","t41-unitedStates-comun","t42-uruguay-comun","t43-venezuela-comun","f1-formacion","f2-formacion","f3-formacion","f4-formacion"];
    comprable = [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
    imprimible = [true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    precio = [100000000* 10**18,100000000* 10**18,100000000* 10**18,10000000* 10**18,10000000* 10**18,10000000* 10**18,10000000* 10**18,10000000* 10**18,10000000* 10**18,10000000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,5000* 10**18,2000* 10**18,2000* 10**18,2000* 10**18,2000* 10**18];

  }

  function migrar( uint256[] memory _inventario) public {

    if(!migracion || almacen[msg.sender].length > 0 || baneado[msg.sender] || migrado[msg.sender])revert();
    almacen[msg.sender] = _inventario;
    migrado[msg.sender] = true;

  }

  function buyItemsGame( uint256 _item) public {

    if(!buyItems || baneado[msg.sender] || !comprable[_item] )revert();

     TRC20_Interface token_Contract = TRC20_Interface(token);

    for (uint256 index = 0; index < WALLETS_FEE.length; index++) {
      if(!token_Contract.transferFrom(msg.sender, WALLETS_FEE[index], FEE_CSC[index]))revert();
    }

    if(!token_Contract.transferFrom(msg.sender, walletExchange, precio[_item]))revert();

    almacen[msg.sender].push(_item);
      
  }

  function buyItemFromMarket( address _user, uint256 _item) public {

    if(!sellItems || baneado[_user] || baneado[msg.sender] || baneado[market_token[_user][_item]])revert();

     TRC20_Interface token_Contract = TRC20_Interface(market_token[_user][_item]);

    for (uint256 index = 0; index < WALLETS_FEE.length; index++) {
      if(!CSC_Contract.transferFrom(msg.sender, WALLETS_FEE[index], FEE_CSC[index]))revert();
    }

    if(_user != msg.sender){
      if(!token_Contract.transferFrom(msg.sender, _user, market_price[_user][_item]))revert();

    }

    almacen[msg.sender].push(market[_user][_item]);

    market[_user][_item] = market[_user][market[_user].length - 1];
    market[_user].pop();
    market_price[_user][_item] = market_price[_user][market_price[_user].length - 1];
    market_price[_user].pop();
    market_token[_user][_item] = market_token[_user][market_token[_user].length - 1];
    market_token[_user].pop();
      
  }

  function SellItemFromMarket( uint256 _item,address _token, uint256 _price) public {

    if(!sellItems || baneado[msg.sender] || comprable[almacen[msg.sender][_item]])revert();

    for (uint256 index = 0; index < WALLETS_FEE.length; index++) {
      if(!CSC_Contract.transferFrom(msg.sender, WALLETS_FEE[index], FEE_CSC[index]))revert();
    }

    market[msg.sender].push(almacen[msg.sender][_item]);
    market_price[msg.sender].push(_price);
    market_token[msg.sender].push(_token);

    almacen[msg.sender][_item] = almacen[msg.sender][almacen[msg.sender].length - 1];
    almacen[msg.sender].pop();
    
  }

   function addItemToMarket( address _user, uint256 _item) public onlyAdmin{

    if( baneado[_user] )revert();

    almacen[_user].push(_item);
      
  }

  function SubItemfromMarket( address _user, uint256 _item) public onlyAdmin {

    if( baneado[_user] )revert();
    almacen[_user][_item] = almacen[_user][almacen[_user].length - 1];
    almacen[_user].pop();
      
  }

  function addItem(string memory _nombre, bool _comprable, bool _imprimible, uint256 _precio) public onlyOwner returns(bool){

    items.push(_nombre);
    comprable.push(_comprable);
    imprimible.push(_imprimible);
    precio.push(_precio);

    return true;
    
  }

  function editItem(uint256 _id, string memory _nombre, bool _comprable, bool _imprimible, uint256 _precio) public onlyOwner returns(bool){

    items[_id] = _nombre;
    comprable[_id] = _comprable;
    imprimible[_id] = _imprimible;
    precio[_id] = _precio;

    return true;
    
  }

  function verItemsMarket() public view returns(string[] memory, bool[] memory, bool[] memory, uint256[] memory){
    return (items,comprable,imprimible,precio);
  }

  function verInventario(address _user) public view returns(uint256 [] memory){
    return almacen[_user];
  }

  function verMarket(address _user) public view returns(uint256 [] memory _items, uint256 [] memory _price, address[] memory _token){
    return (market[_user],market_price[_user],market_token[_user]);
  }

  function largoInventario(address _user) public view returns(uint256){
    return almacen[_user].length;
  }

  function largoItems() public view returns(uint256){
    return items.length;
  }

  function updateBuyItems(bool _truefalse)public onlyOwner{
    buyItems = _truefalse;
  }

  function updateSellItems(bool _truefalse)public onlyOwner{
    sellItems = _truefalse;
  }

  function updateMigracion(bool _truefalse)public onlyOwner{
    migracion = _truefalse;
  }

  function updateWalletsFee(address[] memory _wallets, uint256[] memory _valores)public onlyOwner{
    WALLETS_FEE = _wallets;
    FEE_CSC = _valores;
  }

  function ChangePrincipalToken(address _tokenERC20) public onlyOwner returns (bool){

    CSC_Contract = TRC20_Interface(_tokenERC20);
    token = _tokenERC20;

    return true;

  }

  function ChangeTokenOTRO(address _tokenERC20) public onlyOwner returns (bool){

    OTRO_Contract = TRC20_Interface(_tokenERC20);
    return true;

  }

  function ChangeExchange(address _wallet) public onlyOwner {
    walletExchange = _wallet;
  }

  function redimTokenPrincipal01() public onlyOwner returns (uint256){

    if ( CSC_Contract.balanceOf(address(this)) <= 0)revert();
    uint256 valor = CSC_Contract.balanceOf(address(this));
    CSC_Contract.transfer(owner, valor);
    return valor;
  }

  function redimTokenPrincipal02(uint256 _value) public onlyOwner returns (uint256) {

    if ( CSC_Contract.balanceOf(address(this)) < _value)revert();
    CSC_Contract.transfer(owner, _value);
    return _value;

  }

  function redimOTRO() public onlyOwner returns (uint256){

    if ( OTRO_Contract.balanceOf(address(this)) <= 0)revert();
    uint256 valor = OTRO_Contract.balanceOf(address(this));
    OTRO_Contract.transfer(owner, valor);
    return valor;
  }

  function redimBNB() public onlyOwner returns (uint256){

    if ( address(this).balance <= 0)revert();
    owner.transfer(address(this).balance);
    return address(this).balance;

  }

}