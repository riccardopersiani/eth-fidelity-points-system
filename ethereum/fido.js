import web3 from './web3';
import FidelityPoints from './build/FidelityPoints.json';

// Create the instance from the contract deployed in the Rinkeby network.
const instance = new web3.eth.Contract(
    JSON.parse(FidelityPoints.interface),
    '0x7b6eB72a991876E17F23960623f66A33CFc77689'
);

export default instance;