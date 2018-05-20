const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFidelityPoints = require('./build/FidelityPoints.json');

// Unlock and generate private and public key of the account.
// Need to connect to a real node in Rinkeby through infura.
// Use infura because settign up a node from skretch is really painful and hard.
const provider = new HDWalletProvider(
    'lottery olympic desert matter autumn hurdle recycle remain core future ticket tell',
    'https://rinkeby.infura.io/bagPaFcte2OtdWeyGjdB'
);

// Preconfigured to connect to Rinkeby.
// Completely enabled for the Rinkeby network; can use it to deploy contract, send ether etc...
const web3 = new Web3(provider);

// deploy the contract to Rinkeby.
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // 'interface' is the ABI.
    const result = await new web3.eth.Contract(JSON.parse(compiledFidelityPoints.interface))
        .deploy({ data: compiledFidelityPoints.bytecode })
        .send({
            gas: '4500000',
            from: accounts[0]
        });

    console.log('Contract deployed to', result.options.address);
};
deploy();