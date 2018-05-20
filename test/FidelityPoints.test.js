const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFidelityPoints = require('../ethereum/build/FidelityPoints.json');

let fidelityPointsInstance;

// Purpose is to the Ethreum transfer contract
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    // Created the idea of the EthereumTransfer contract inside web3 parsing the ABI from the JSON file
    fidelityPointsInstance = await new web3.eth.Contract(JSON.parse(compiledFidelityPoints.interface))
    .deploy({ data: compiledFidelityPoints.bytecode })
    .send({
        from: accounts[0],
        gas: '4500000' // why changing this value enables the test to pass?
    });
});

describe('FidelityPoints', () => {
    // Check if the contract has been deployed correctly.
    it('deploys a FidelityPoints contract', () => {
        assert.ok(fidelityPointsInstance.options.address);
    });

    it('marks deployer as the contract owner', async () => {
        const owner = await fidelityPointsInstance.methods.owner().call();
        assert.equal(accounts[0], owner);
    });

    it('reads token information', async () => {
        const SYMBOL = await fidelityPointsInstance.methods.SYMBOL().call();
        const NAME = await fidelityPointsInstance.methods.NAME().call();
        const DECIMALS = await fidelityPointsInstance.methods.DECIMALS().call();
        const RATE = await fidelityPointsInstance.methods.RATE().call();
        assert.equal(SYMBOL, 'FIDO');
        assert.equal(NAME, 'Fido Coin');
        assert.equal(DECIMALS, 18);
        assert.equal(RATE, 1000000000000000000);
    });

    it('create tokens', async () => {
        let balanceFinal;
        let balanceStart = await fidelityPointsInstance.methods.balanceOf(accounts[0]).call();
        balanceStart = parseFloat(balanceStart);

        try {
            await fidelityPointsInstance.methods.createTokens().send({
                from: accounts[0],
                value: '1'
            });
            balanceFinal = await fidelityPointsInstance.methods.balanceOf(accounts[0]).call();
            balanceFinal = parseFloat(balanceFinal);

            assert(balanceFinal > balanceStart);
        } catch (err) {
            assert.fail(err);
        }
    });

    /*
    * start total supply:            1000000000.
    * final total supply:   2000000001000000000.
    * */
    it('totalSupply increment with token creation', async () => {
        let totalSupplyStart;
        let totalSupplyFinal;
        try {
            totalSupplyStart = await fidelityPointsInstance.methods.totalSupply().call();
            await fidelityPointsInstance.methods.createTokens().send({
                value: '2',
                from: accounts[0]
            });
            totalSupplyFinal = await fidelityPointsInstance.methods.totalSupply().call();
            assert(totalSupplyFinal>totalSupplyStart);

        } catch (err) {
            assert.fail(err);
        }
    });

    it('only manager can create new tokens', async () => {
        let balance = await fidelityPointsInstance.methods.balanceOf(accounts[1]).call();
        balance = parseFloat(balance);
        console.log("starting balance: " + balance);

        try {
            await fidelityPointsInstance.methods.createTokens().send({
                value: '20',
                from: accounts[1]
            });
        } catch (err) {
            balance = await fidelityPointsInstance.methods.balanceOf(accounts[1]).call();
            balance = parseFloat(balance);
            console.log("after catch() balance: " + balance);
            assert(balance == 0);
        }
    });

    it('getSummary', async () => {
        try {
            const summary = await fidelityPointsInstance.methods.getSummary().call();
            console.log("summary[0]: " + summary[0]);
            console.log("summary[1]: " + summary[1]);
            console.log("summary[2]: " + summary[2]);
            console.log("summary[3]: " + summary[3]);
            console.log("summary[4]: " + summary[4]);
            assert(summary[4],"FIDO");
        } catch (err) {
            assert.fail(err);
        }
    });
});