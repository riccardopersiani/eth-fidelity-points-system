const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


// Take the path of the build directory.
const buildPath = path.resolve(__dirname, 'build');

// Delete the build directory.
fs.removeSync(buildPath);

// Take the the correct path of the contract to be compiled.
const fidelityPointsPath = path.resolve(__dirname, 'contracts', 'FidelityPoints.sol');

// Now got the contents of FidelityPoint file.
const sourceFidelityPoints = fs.readFileSync(fidelityPointsPath,'utf8');

// Compiling the source here means that output contains four objects, one output for every contract: FidelityPoints.sol, IERC20.sol, Owned.sol, SafeMath.sol.
const output = solc.compile(sourceFidelityPoints, 1).contracts;

// Check if the build directory has been deleted, if yes it recreates the folder.
fs.ensureDirSync(buildPath);

// The key is assigned to contract and the key is ':FidelityPoints', ':IERC20', ':Owned', ':SafeMath'.
for (let contract in output) {
    // Write out a json file.
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    );
}

