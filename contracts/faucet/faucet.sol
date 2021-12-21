pragma solidity >=0.8.0;
// SPDX-License-Identifier: Apache 2.0

contract Context {
  constructor () { }

  function _msgSender() internal view virtual returns (address) {
      return msg.sender;
  }

  function _msgData() internal view virtual returns (bytes calldata) {
      this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
      return msg.data;
  }
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

interface TRC20_Interface{

    function allowance(address _owner, address _spender) external view returns (uint remaining);

    function transferFrom(address _from, address _to, uint _value) external returns (bool);

    function transfer(address direccion, uint cantidad) external returns (bool);

    function balanceOf(address who) external view returns (uint256);

    function decimals() external view returns(uint);
}

contract Ownable is Context {
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
    require(admin[msg.sender]);
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

contract Faucet is Context, Admin{
  using SafeMath for uint256;
  
  address public token = 0x038987095f309d3640F51644430dc6C7C4E2E409;

  TRC20_Interface CSC_Contract = TRC20_Interface(token);
  TRC20_Interface OTRO_Contract = TRC20_Interface(token);

  struct Investor {
    uint256 tiempo;
  }

  uint256 public paso = 1 * 8600;

  uint256 public cantidad = 2000 * 10**18;

  
  mapping (address => Investor) public investors;
  

  constructor() {}

  
  function claim() public returns(bool){

    Investor storage usuario = investors[_msgSender()];

    if(block.timestamp < usuario.tiempo+paso)revert("no es hora de volver a reclamar");

    if(!CSC_Contract.transfer(_msgSender(), cantidad))revert();

    usuario.tiempo = block.timestamp;
    
    return true;
      
  }

  function updateCantidad(uint256 _cantidadCSC) public onlyOwner returns (bool){

    cantidad = _cantidadCSC;

    return true;

  }

  function updateIntervalo(uint256 _tiempo) public onlyOwner returns (bool){

    paso = _tiempo;

    return true;

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

  function redimETH() public onlyOwner returns (uint256){

    if ( address(this).balance <= 0)revert();

    owner.transfer(address(this).balance);

    return address(this).balance;

  }

}