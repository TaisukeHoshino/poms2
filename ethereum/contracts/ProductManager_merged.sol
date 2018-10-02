
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


  // adminのアドレスを登録する
  function manufacturersManager() public {
      admin = msg.sender;
  }

  function getManufacuturerSummary(uint _companyId) public view returns(uint, uint, string, address){
    return (
      manufacturerInfos[_companyId].id,
      manufacturerInfos[_companyId].companyPrefix,
      manufacturerInfos[_companyId].companyName,
      companyPrefixToAddress[manufacturerInfos[_companyId].companyPrefix]
      );
  }

  modifier onlyAdmim() {
      require(msg.sender == admin);
      _;
  }
}



contract ProductManager_merged is ManufacturersManager{
  //製品の状態
   enum ProductStatus {Shipped, Owned, Merged}

   //製品の情報構造
   struct ProductInfo {
       address owner;
       address recipient;
       address manufacturer;
       ProductStatus pStatus;
       uint creationTime;
       uint8 nTransferred;
       uint[] oldEPC;
   }

   //製品のEPCを受けて、製品の情報構造を返す
   mapping (uint => ProductInfo) products;
   uint[] public EPCs;



   function enrollMergedProduct(uint _EPC, uint _oldEPC) public onlyExist(_EPC) onlyExist(_oldEPC) onlyOwner(_EPC) onlyOwner(_oldEPC) onlyStatusIs(_EPC, ProductStatus.Owned) onlyStatusIs(_oldEPC, ProductStatus.Owned) {
        // 合流元のEPCを現在のEPCの製品情報に加える
        products[_EPC].oldEPC.push(_oldEPC);
        // 合流元の製品の状態をMergedにする
        products[_oldEPC].pStatus = ProductStatus.Merged;

        EPCs.push(_EPC);
   }

   function getOldProduct(uint _EPC) public view returns(uint []){
       return products[_EPC].oldEPC;

   }


   //製品（EPC）が本当に呼び出したメーカーのものなのか確認
   /* function checkAuthorship(uint _EPC) returns(bool){
       //EPCデータベースで確認⇨今の所できない
   } */

   //製品をブロックチェーン上に登録
   function enrollProduct(uint _EPC) public onlyNotExist(_EPC) onlyManufacturer(){
     //if checkAuthorship(_EPC)
      products[_EPC].owner = msg.sender;
      products[_EPC].manufacturer = msg.sender;
      products[_EPC].pStatus = ProductStatus.Owned;
      products[_EPC].creationTime = now;
      products[_EPC].nTransferred = 0;

      EPCs.push(_EPC);
   }

   function shipProduct(address _reciever, uint _EPC) public onlyExist(_EPC) onlyOwner(_EPC) onlyStatusIs(_EPC, ProductStatus.Owned) {
     if (_reciever == products[_EPC].owner) {
           //製品の所有者が_recieverの時（すでに出発している）、何もしない
           /* throw; */
       } else {
           //製品の所有者が_recieverじゃないとき
           products[_EPC].pStatus = ProductStatus.Shipped;
           products[_EPC].recipient = _reciever;
       }
   }


     // 受け手は、製品を受け取ったら、製品の所有者、ステータス、配送回数を更新
     function receiveProduct(uint _EPC) public onlyExist(_EPC) onlyRecipient(_EPC) onlyStatusIs(_EPC, ProductStatus.Shipped) {
         products[_EPC].owner = msg.sender;
         products[_EPC].pStatus = ProductStatus.Owned;
         products[_EPC].nTransferred = products[_EPC].nTransferred + 1;
         // if (products[EPC].nTransferred <= MAXTRANSFER) {
         //     msg.sender.send(transferReward);
         // }
     }


    //確認用
     function getCurrentOwner(uint _EPC) public view returns(address){
       return(products[_EPC].owner);
     }

     function getManufacturerAddress (uint _EPC) public view returns(address) {
         return(products[_EPC].manufacturer);
     }

    function getProductSummary(uint _EPC) public view returns(
       address, address, address, ProductStatus, uint, uint8, uint[]
       ) {
       return (
         products[_EPC].owner,
         products[_EPC].recipient,
         products[_EPC].manufacturer,
         products[_EPC].pStatus,
         products[_EPC].creationTime,
         products[_EPC].nTransferred,
         products[_EPC].oldEPC
         );
     }

    function getOwndProduct(address _owner) public view returns(uint []) {
        uint[] memory result = new uint[](EPCs.length);
        uint counter = 0;
        for (uint i = 0; i < EPCs.length; i++) {
          if (products[EPCs[i]].owner == _owner) {
            result[counter] = EPCs[i];
            counter++;
          }
        }
        return result;
    }

    function getRecieveProduct(address _reciever) public view returns(uint []) {
        uint[] memory result = new uint[](EPCs.length);
        uint counter = 0;
        for (uint i = 0; i < EPCs.length; i++) {
          if (products[EPCs[i]].recipient == _reciever) {
              if (products[EPCs[i]].owner != _reciever) {
                result[counter] = EPCs[i];
                counter++;
              }
          }
        }
        return result;
    }



    /////////modifier/////////

    // ブロックチェーンに登録された正規の製造業か→バグ（誰でも製品を登録できてしまう）
    modifier onlyManufacturer() {
        require(companyPrefixToAddress[addressToManufacturer[msg.sender].companyPrefix] != msg.sender);
        _;
    }

    //指定されたEPCがブロックチェーン上にすでに登録されていないか
    modifier onlyNotExist (uint _EPC) {
        require(products[_EPC].owner == 0x0);
        _;
    }

    //指定されたEPCがブロックチェーン上に登録されているか
    modifier onlyExist (uint _EPC)  {
        require(products[_EPC].owner != 0x0);
        _;
    }


    //指定されたEPCの受け手なのかどうか
    modifier onlyRecipient (uint _EPC) {
        require(products[_EPC].recipient == msg.sender);
        _;
    }

     //指定されたEPCの所有者なのか
    modifier onlyOwner (uint _EPC) {
        require(products[_EPC].owner == msg.sender);
        _;
    }


    //指定されたEPCの状態が、指定されている状態になっているか
    modifier onlyStatusIs (uint _EPC, ProductStatus thisStatus) {
        require(products[_EPC].pStatus == thisStatus);
        _;
    }


}
