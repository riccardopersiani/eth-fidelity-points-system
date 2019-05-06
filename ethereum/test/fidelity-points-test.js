const {
    waitForEvent,
} = require('./utils')

const web3 = require('../web3');
const fidelityPoints = artifacts.require('./FidelityPoints.sol')
const assert = require('assert');

contract('Fidelity Points Tests', async accounts => {

  const gasAmt = 3e6
  const address = accounts[0]

  before(async () => (
    { contract } = await fidelityPoints.deployed(),
    { methods } = contract,
    { events } = new web3.eth.Contract(
      contract._jsonInterface,
      contract._address
    )
  ))

  describe('FidelityPoints', () => {
	  // Check if the contract has been deployed correctly.
	  it('deploys a FidelityPoints contract', () => {
		  assert.ok(fidelityPoints.options.address);
	  });

	  it('marks deployer as the contract owner', async () => {
		  const owner = await fidelityPoints.methods.owner().call();
		  assert.equal(accounts[0], owner);
	  });

	  it('reads token information', async () => {
		  const SYMBOL = await fidelityPoints.methods.SYMBOL().call();
		  const NAME = await fidelityPoints.methods.NAME().call();
		  const DECIMALS = await fidelityPoints.methods.DECIMALS().call();
		  const RATE = await fidelityPoints.methods.RATE().call();
		  assert.equal(SYMBOL, 'FIDO');
		  assert.equal(NAME, 'Fido Coin');
		  assert.equal(DECIMALS, 18);
		  assert.equal(RATE, 1000000000000000000);
	  });

	  it('create tokens', async () => {
		  let balanceFinal;
		  let balanceStart = await fidelityPoints.methods.balanceOf(accounts[0]).call();
		  balanceStart = parseFloat(balanceStart);

		  try {
			  await fidelityPoints.methods.createTokens().send({
				  from: accounts[0],
				  value: '1'
			  });
			  balanceFinal = await fidelityPoints.methods.balanceOf(accounts[0]).call();
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
			  totalSupplyStart = await fidelityPoints.methods.totalSupply().call();
			  await fidelityPoints.methods.createTokens().send({
				  value: '2',
				  from: accounts[0]
			  });
			  totalSupplyFinal = await fidelityPoints.methods.totalSupply().call();
			  assert(totalSupplyFinal>totalSupplyStart);

		  } catch (err) {
			  assert.fail(err);
		  }
	  });

	  it('only manager can create new tokens', async () => {
		  let balance = await fidelityPoints.methods.balanceOf(accounts[1]).call();
		  balance = parseFloat(balance);
		  console.log("starting balance: " + balance);

		  try {
			  await fidelityPoints.methods.createTokens().send({
				  value: '20',
				  from: accounts[1]
			  });
		  } catch (err) {
			  balance = await fidelityPoints.methods.balanceOf(accounts[1]).call();
			  balance = parseFloat(balance);
			  console.log("after catch() balance: " + balance);
			  assert(balance == 0);
		  }
	  });

	  it('getSummary', async () => {
		  try {
			  const summary = await fidelityPoints.methods.getSummary().call();
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

  it('Should have logged event...', async () => {
    const {
      returnValues: {
        description
      }
    } = await waitForEvent(events.LogNewOraclizeQuery)
    assert.strictEqual(
      description,
      'event print',
      'Oraclize query incorrectly logged!'
    )
  })

  it('Should revert on...', async () => {
    const expErr = 'Transaction has been reverted'
    try {
      await methods
        .update()
        .send({
          from: address,
          gas: gasAmt
        })
      assert.fail('Update transaction should not have succeeded!')
    } catch (e) {
      assert.isTrue(
        e.message.startsWith(`${expErr}`),
        `Expected ${expErr} but got ${e.message} instead!`
      )
    }
  })
})

