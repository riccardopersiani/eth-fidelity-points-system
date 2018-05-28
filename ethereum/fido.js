import web3 from './web3';
import FidelityPoints from './build/FidelityPoints.json';

// Create the instance from the contract deployed in the Rinkeby network.
const instance = new web3.eth.Contract(
    JSON.parse(FidelityPoints.interface),
    '0x3735543206B4bbA0fC09E2Bd2E4906D2143AeB9B'
);

export default instance;