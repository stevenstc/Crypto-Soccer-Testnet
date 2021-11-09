pragma solidity >=0.8.0;
// SPDX-License-Identifier: Apache 2.0

import "./SafeMath.sol";
import "./InterfaseTRC20.sol";
import "./Admin.sol";

contract Market is Admin{
  using SafeMath for uint256;
  
  address public token = 0xF0fB4a5ACf1B1126A991ee189408b112028D7A63;
  address public adminWallet = 0x004769eF6aec57EfBF56c24d0A04Fe619fBB6143;
  uint256 public ventaPublica = 1635368400;

  TRC20_Interface CSC_Contract = TRC20_Interface(token);
  TRC20_Interface OTRO_Contract = TRC20_Interface(token);

  struct Tipos {
    string tipo;
    bool ilimitados;
    uint256 cantidad;

  }

  struct Investor {
    bool registered;
    string correo;
    uint256 balance;
    uint256 gastado;
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
  mapping (address => Item[]) public inventario;
  
  Item[] public items;
  Tipos[] public opciones;

  uint256 ingresos;
  uint256 retiros;

  constructor() {
     
    items.push(
    Item(
    {
      nombre:"t1-brazil-legendario",
      tipo: "legendario",
      valor: 1250 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 1000
    }));
    items.push(
    Item(
    {
      nombre:"t2-argentina-legendario",
      tipo: "legendario",
      valor: 1250 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 1000
    }));
    items.push(
    Item(
    {
      nombre:"t3-alemania-legendario",
      tipo: "legendario",
      valor: 1250 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 1000
    }));
    items.push(
    Item(
    {
      nombre:"t4-japon-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 500
    }));
    items.push(
    Item(
    {
      nombre:"t5-colombia-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 500
    }));
    items.push(
    Item(
    {
      nombre:"t6-mexico-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 1500
    }));
    items.push(
    Item(
    {
      nombre:"t7-croacia-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 750
    }));
    items.push(
    Item(
    {
      nombre:"t8-EU-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 500
    }));
    items.push(
    Item(
    {
      nombre:"t9-portugal-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 750
    }));
    items.push(
    Item(
    {
      nombre:"t10-esp-epico",
      tipo: "epico",
      valor: 875 * 10**18,
      acumulable: false,
      ilimitado: false,
      cantidad: 500
    }));

    opciones.push( 
    Tipos({
      tipo :"legendario",
      ilimitados: false,
      cantidad: 1}
    ));
    opciones.push(
    Tipos({
      tipo :"epico",
      ilimitados: false,
      cantidad: 1}
    ));

  }

  function registro(string memory _correo) public{
    
    Investor storage usuario = investors[msg.sender];

    if(usuario.registered)revert();
   
    usuario.registered = true;
    usuario.correo = _correo;

  }

  function updateRegistro(string memory _correo) public{
    
    Investor storage usuario = investors[msg.sender];

    if(!usuario.registered)revert();
   
    usuario.correo = _correo;

  }

  function updateRegistroMaster(address _user, string memory _correo) public onlyOwner{
    
    Investor storage usuario = investors[_user];

    if(!usuario.registered)revert();
   
    usuario.correo = _correo;

  }

  function viewDuplicatedItem(uint256 _id) private view returns(bool){

    Item memory item = items[_id];
    Item[] memory myInventario = inventario[msg.sender];
    bool duplicado = false;
    

     for (uint256 i = 0; i < myInventario.length; i++) {

       if(keccak256(abi.encodePacked(myInventario[i].nombre)) == keccak256(abi.encodePacked(item.nombre))){
         duplicado = true;
         break;
       }

       if(keccak256(abi.encodePacked(myInventario[i].tipo)) == keccak256(abi.encodePacked(item.tipo))){
         uint256 cantidad = 0;
         for (uint256 e = 0; e < opciones.length; e++) {
           if(keccak256(abi.encodePacked(myInventario[i].tipo)) == keccak256(abi.encodePacked(opciones[e].tipo))){
             cantidad++;
             if(cantidad >= opciones[e].cantidad && !opciones[e].ilimitados){
                duplicado = true;
                break;
              }
           }
            
         }
         
       }
       
     }

     return duplicado;

  }
  
  function tiempo() public view returns(uint256){
      return block.timestamp;
  } 
  
  function buyItem(uint256 _id) public returns(bool){

    if( block.timestamp < ventaPublica )revert();

    Investor memory usuario = investors[msg.sender];
    Item memory item = items[_id];

    if (!item.acumulable){
      if (viewDuplicatedItem(_id))revert();
    }
    
    if ( !usuario.registered)revert();
    if ( !item.ilimitado){
      if(item.cantidad == 0)revert();
    }
    
    if( CSC_Contract.allowance(msg.sender, address(this)) < item.valor )revert();
    if(!CSC_Contract.transferFrom(msg.sender, adminWallet, item.valor))revert();
    
    if ( !item.ilimitado){
      items[_id].cantidad -= 1;
    }
    
    inventario[msg.sender].push(item);
    ingresos += item.valor;

    return true;
      
  }

   function buyCoins(uint256 _value) public returns(bool){

    Investor storage usuario = investors[msg.sender];

    if ( !usuario.registered) revert();

    if( CSC_Contract.allowance(msg.sender, address(this)) < _value )revert();
    if(!CSC_Contract.transferFrom(msg.sender, address(this), _value))revert();
  
    usuario.balance += _value;
    ingresos += _value;

    return true;
    
  }

  function sellCoins(uint256 _value) public returns (bool) {
      Investor storage usuario = investors[msg.sender];

      if (!usuario.registered) revert();
      if (usuario.gastado+_value > usuario.balance)revert();

      if (CSC_Contract.balanceOf(address(this)) < _value)
          revert();
      if (!CSC_Contract.transfer(msg.sender,  _value))
          revert();

      usuario.gastado += _value;
      retiros += _value;

      return true;
    }

  function gastarCoins(uint256 _value) public returns(bool){

    Investor storage usuario = investors[msg.sender];

    if ( !usuario.registered && usuario.gastado.add(_value) > usuario.balance) revert();
      
    usuario.gastado += _value;

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

  function addOption(string memory _tipo, bool _ilimitado, uint256 _cantidad) public onlyOwner returns(bool) {

    opciones.push(
      Tipos({
      tipo : _tipo,
      ilimitados: _ilimitado,
      cantidad: _cantidad})
    );
    return true;

  }

  function editOption(uint256 _id, string memory _tipo, bool _ilimitado, uint256 _cantidad) public onlyOwner returns(bool) {

    opciones[_id] = 
      Tipos({
      tipo : _tipo,
      ilimitados: _ilimitado,
      cantidad: _cantidad});
    return true;

  }

  function largoInventario(address _user) public view returns(uint256){

    Item[] memory invent = inventario[_user];

    return invent.length;
      
  }

  function largoItems() public view returns(uint256){

    return items.length;
      
  }
  
  function largoOptions() public view returns(uint256){

    return opciones.length;
      
  }

  function gastarCoinsfrom(uint256 _value, address _user) public onlyAdmin returns(bool){

    Investor storage usuario = investors[_user];

    if ( !usuario.registered && usuario.gastado.add(_value) > usuario.balance) revert();
      
    usuario.gastado += _value;

    return true;
    
  }

  function asignarCoinsTo(uint256 _value, address _user) public onlyAdmin returns(bool){

    Investor storage usuario = investors[_user];

    if ( !usuario.registered && usuario.gastado.add(_value) > usuario.balance) revert();
      
    usuario.balance += _value;

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