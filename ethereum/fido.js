import web3 from './web3';
import FidelityPoints from './build/FidelityPoints.json';

// Create the instance from the contract deployed in the Rinkeby network.
const instance = new web3.eth.Contract(
    JSON.parse(FidelityPoints.interface),
    '0xf6412D8dFcb5f1daDe01C281e23289c9BB5AFBfB'
);

export default instance;