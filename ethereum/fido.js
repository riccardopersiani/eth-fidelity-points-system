import web3 from './web3';
import FidelityPoints from './build/FidelityPoints.json';

// Create the instance from the contract deployed in the Rinkeby network.
const instance = new web3.eth.Contract(
    JSON.parse(FidelityPoints.interface),
    '0x221cBEA0273Ef9Aa0a68D2C85a5fd16cAda15237'
);

export default instance;