import Web3 from 'web3';

let web3;

// Check if Metamask is available or not; typeof used to see if a variable is defined.
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and Metamask is running.
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are on the browser *OR* the user is not running Metamask.
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/bagPaFcte2OtdWeyGjdB'
    );

    web3 = new Web3(provider);
}

// Export the new instance.
export default web3;