
pragma solidity ^0.4.18;


contract ManufacturersManager {


  address admin;

  struct ManufacturerInfo {
    uint id;
    uint companyPrefix;
    string companyName;
    // uint expireTime;

  }
  /* ManufacturerInfo[] public manufacturerInfos; */
  mapping(uint => ManufacturerInfo) public manufacturerInfos;
  mapping(address => ManufacturerInfo) addressToManufacturer;
  mapping(uint => address) companyPrefixToAddress;

  uint manufacturerCounter;



  function enrollManufacturer (address companyAddress, uint _companyPrefix, string _companyName) public onlyAdmim() {
    //manufacturerInfosのid(manufacturerCounter)=1番目から代入している
    manufacturerCounter ++;
    manufacturerInfos[manufacturerCounter] = ManufacturerInfo(manufacturerCounter, _companyPrefix, _companyName);
    companyPrefixToAddress[_companyPrefix] = companyAddress;
  }

  function getManufacturer() public view returns(uint []) {
    //idを入れるarrayを用意
    uint[] memory manufacturerIds = new uint[](manufacturerCounter);
    uint numberOfManufacturer = 0;

    //配列にmanufacturerのidを入れていく(mappingにはid=1番目から入っているのでi=1からroopする)
    for(uint i = 1; i <= manufacturerCounter; i++){
      manufacturerIds[numberOfManufacturer] = manufacturerInfos[i].id;
      numberOfManufacturer++;
    }
    return manufacturerIds;
  }

  function getManufacuturerSummary(uint _companyId) public view returns(uint, uint, string, address){
    return (
      manufacturerInfos[_companyId].id,
      manufacturerInfos[_companyId].companyPrefix,
      manufacturerInfos[_companyId].companyName,
      companyPrefixToAddress[manufacturerInfos[_companyId].companyPrefix]
      );
  }


  // adminのアドレスを登録する
  function manufacturersManager() public {
      admin = msg.sender;
  }

  modifier onlyAdmim() {
      require(msg.sender == admin);
      _;
  }
}
