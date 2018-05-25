import web3 from './web3';
import FidelityPoints from './build/FidelityPoints.json';

// Create the instance from the contract deployed in the Rinkeby network.
const instance = new web3.eth.Contract(
    JSON.parse(FidelityPoints.interface),
    '0xe73031F33bFc0F89B4E111b0ee3336dE9fbF9Ecc'
);

export default instance;