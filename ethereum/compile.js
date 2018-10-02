const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Delete build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Read the contract file
const pmPath = path.resolve(__dirname, 'contracts', 'ProductManager_merged.sol');
const mmPath = path.resolve(__dirname, 'contracts', 'ManufacturerManager.sol');


const source = fs.readFileSync(pmPath, 'utf8');


// Compile Contracts
const output = solc.compile(source, 1).contracts;
console.log(output);

// Write output to build directory
fs.ensureDirSync(buildPath);

for (let contract in output) [
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  )
]
