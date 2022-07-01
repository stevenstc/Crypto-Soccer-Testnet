pragma solidity >=0.8.0;
// SPDX-License-Identifier: Apache 2.0

interface TRC20_Interface {

    function allowance(address _owner, address _spender) external view returns (uint remaining);
    function transferFrom(address _from, address _to, uint _value) external returns (bool);
    function transfer(address direccion, uint cantidad) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
    function decimals() external view returns(uint);
}

interface IMARKETV1 {
  function largoInventario(address _user) external view returns(uint256);
}

interface ITRC721 {

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;

    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) external;
    function totalSupply() external view returns (uint256);
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

contract Market_V2 is Admin{
  using SafeMath for uint256;

  address public tokenTRC721 = 0xf0218BBD50DdF065b7A43862FD9e27ee1925c050;

  bool public printNfts = true;

  address[] public WALLETS_PRINT_NFT_CSC = [0x0c4c6519E8B6e4D9c99b09a3Cda475638c930b00,0x000000000000000000000000000000000000dEaD,0x004769eF6aec57EfBF56c24d0A04Fe619fBB6143];
  uint256[] public PRINT_NFT_CSC = [500 * 10**18,500 * 10**18,500 * 10**18];
 
  address public token = 0xF0fB4a5ACf1B1126A991ee189408b112028D7A63;
  address public adminWallet = 0x004769eF6aec57EfBF56c24d0A04Fe619fBB6143;
  uint256 public ventaPublica = 1635349239;

  uint256 public MIN_CSC = 500 * 10**18;
  uint256 public MAX_CSC = 10000 * 10**18;

  uint256 public TIME_CLAIM = 7 * 86400;

  IMARKETV1 MARKET_V1 = IMARKETV1(0xfF7009EF7eF85447F6A5b3f835C81ADd60a321C9);
  
  ITRC721 TRC721_Contract = ITRC721(tokenTRC721);

  TRC20_Interface CSC_Contract = TRC20_Interface(token);
  TRC20_Interface OTRO_Contract = TRC20_Interface(token);

  struct Tipos {
    string tipo;
    bool ilimitados;
    uint256 cantidad;

  }

  struct Investor {
    bool baneado;
    uint256 balance;
    uint256 payAt;
    uint256 almacen;
    uint256 printItems;
  }

  struct Item {
    string nombre;
    string tipo;
    uint256 valor;
    bool acumulable;
    bool ilimitado;
    uint256 cantidad;
  }
  
  mapping (address => Investor) public investors;
  mapping (address => uint256[]) public IDNft;


  Item[] public items;

  uint256 ingresos;
  uint256 retiros;

  constructor() {

    items.push(Item(
    {
      nombre:"t1-brazil-legendario",
      tipo: "legendario",
      valor: 1250 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
     
    items.push(
    Item(
    {
      nombre:"t2-argentina-legendario",
      tipo: "legendario",
      valor: 1250 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t3-alemania-legendario",
      tipo: "legendario",
      valor: 1250 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t4-japon-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t5-colombia-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t6-mexico-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t7-croacia-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t8-EU-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t9-portugal-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));
    items.push(
    Item(
    {
      nombre:"t10-esp-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 0
    }));

  }

  function printItem( address _user, string memory _metadata) public returns(bool){

    if(!printNfts)revert();

    if(MARKET_V1.largoInventario(_user)<=0)revert();

    Investor memory usuario = investors[_user];
 
    if ( usuario.baneado )revert();

    if (usuario.printItems >= 2)revert();

    for (uint256 index = 0; index < WALLETS_PRINT_NFT_CSC.length; index++) {
      if(!CSC_Contract.transferFrom(msg.sender, WALLETS_PRINT_NFT_CSC[index], PRINT_NFT_CSC[index]))revert();
    }

    TRC721_Contract.mintWithTokenURI(_user, TRC721_Contract.totalSupply(), _metadata);
    usuario.printItems++;

    return true;
      
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

      if (CSC_Contract.balanceOf(address(this)) < _value)
          revert();
      if (!CSC_Contract.transfer(msg.sender,  _value))
          revert();

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

  function addItem(string memory _nombre, string memory _tipo, uint256 _value, bool _acumulable, bool _ilimitado, uint256 _cantidad) public onlyOwner returns(bool){

    items.push(
      Item(
        {
          nombre: _nombre,
          tipo: _tipo,
          valor: _value,
          acumulable: _acumulable,
          ilimitado: _ilimitado,
          cantidad: _cantidad
        }
      )
    );

    return true;
    
  }

  function editItem(uint256 _id, string memory _nombre, string memory _tipo, uint256 _value, bool _acumulable, bool _ilimitado, uint256 _cantidad) public onlyOwner returns(bool){

    items[_id] = Item(
    {
      nombre: _nombre,
      tipo: _tipo,
      valor: _value,
      acumulable: _acumulable,
      ilimitado: _ilimitado,
      cantidad: _cantidad
    });

    return true;
    
  }

  function largoInventario(address _user) public view returns(uint256){

    return IDNft[_user].length;
      
  }

  function largoItems() public view returns(uint256){

    return items.length;
      
  }

  function updatePrintNfts(bool _truefalse)public onlyOwner{
    printNfts = _truefalse;
  }

  
  function updateWalletsPrints(address[] memory _wallets, uint256[] memory _valores)public onlyOwner{
    WALLETS_PRINT_NFT_CSC = _wallets;
    PRINT_NFT_CSC = _valores;
  }

  function updateMinMax(uint256 _min, uint256 _max)public onlyOwner{
    MIN_CSC = _min;
    MAX_CSC = _max;
  }

  function updateTimeClaim(uint256 _time)public onlyOwner{
    TIME_CLAIM = _time;
  }

  function updateMarketV1(address _market)public onlyOwner{
    MARKET_V1 = IMARKETV1(_market);

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