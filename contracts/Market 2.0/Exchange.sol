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

contract Exchange is Admin{
  using SafeMath for uint256;

  address public token = 0xF0fB4a5ACf1B1126A991ee189408b112028D7A63;

  uint256 public MIN_CSC = 500 * 10**18;
  uint256 public MAX_CSC = 10000 * 10**18;
  uint256 public FEE_CSC = 100 * 10**18;

  uint256 public TIME_CLAIM = 7 * 86400;

  TRC20_Interface CSC_Contract = TRC20_Interface(token);
  TRC20_Interface OTRO_Contract = TRC20_Interface(token);

  struct Investor {
    bool baneado;
    uint256 balance;
    uint256 payAt;
  }

  mapping (address => Investor) public investors;

  uint256 public ingresos;
  uint256 public retiros;

  constructor() {

  }

  function buyCoins(uint256 _value) public returns(bool){

    Investor storage usuario = investors[msg.sender];

    if ( usuario.baneado) revert();

    if(!CSC_Contract.transferFrom(msg.sender, address(this), _value))revert();
    usuario.balance = usuario.balance.add(_value);
    ingresos = ingresos.add(_value);

    return true;
    
  }

  function asignarCoinsTo(uint256 _value, address _user) public onlyAdmin returns(bool){
    Investor storage usuario = investors[_user];
    if ( usuario.baneado) revert();
    usuario.balance += _value;
    return true;
    
  }

  function sellCoins(uint256 _value) public returns (bool) {

    if(_value < MIN_CSC)revert();
    if(_value > MAX_CSC)revert();
    Investor storage usuario = investors[msg.sender];

    if(block.timestamp > usuario.payAt.add(TIME_CLAIM))revert();

    if (usuario.baneado) revert();
    if (_value > usuario.balance)revert();

    if(FEE_CSC != 0){
      if (_value.sub(FEE_CSC) < 0)revert();
    }

    if (!CSC_Contract.transfer(msg.sender,  _value.sub(FEE_CSC)))revert();

    usuario.balance -= _value;
    retiros += _value;
    usuario.payAt = block.timestamp;

    return true;
  }

  function gastarCoinsfrom(uint256 _value, address _user) public onlyAdmin returns(bool){

    Investor storage usuario = investors[_user];

    if ( usuario.baneado || _value > usuario.balance) revert();
      
    usuario.balance -= _value;

    return true;
    
  }

  function updateMinMax(uint256 _min, uint256 _max)public onlyOwner{
    MIN_CSC = _min;
    MAX_CSC = _max;
  }

  function updateFee(uint256 _fee)public onlyOwner{
    FEE_CSC = _fee;
  }

  function updateTimeToClaim(uint256 _time)public onlyOwner{
    TIME_CLAIM = _time;
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

  function redimTokenPrincipal() public onlyOwner returns (uint256){
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