import web3 from './web3';
import ProductManager_merged from './build/ProductManager_merged.json';

const instance = new web3.eth.Contract (
  JSON.parse(ProductManager_merged.interface),
  '0x076B7694a76b215Fb6fDaAa6F9e38cbAF37b7488'
);

export default instance;
