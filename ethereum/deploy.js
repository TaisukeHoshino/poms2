const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledContract = require('./build/ProductManager_merged.json');

const provider = new HDWalletProvider(
  // metamask's mnemonic
  `candy maple cake sugar pudding cream honey rich smooth crumble sweet treat`,
  // API LINK
  'https://rinkeby.infura.io/2m0xTxgDWrJZQ9exLVJH',
  8
);
const web3 = new Web3(provider);


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledContract.interface)
  )
  .deploy({ data: '0x'+compiledContract.bytecode })
  .send({ gas: '3000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);

};

deploy();
