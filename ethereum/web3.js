import Web3 from 'web3';

// const web3 = new Web3(window.web3.provider);
// window cannot be used in server side

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running
  web3 = new Web3(window.web3.currentProvider);

} else {
  // WE are on the server or  the user is not using metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/2m0xTxgDWrJZQ9exLVJH'
  );
  web3 = new Web3(provider);

}

export default web3;
