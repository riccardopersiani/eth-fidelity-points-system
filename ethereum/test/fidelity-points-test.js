const {
    waitForEvent,
} = require('./utils')

const web3 = require('../web3');
const fidelityPoints = artifacts.require('./FidelityPoints.sol')

contract('❍  Fidelity Points Tests', async accounts => {

  const gasAmt = 3e6
  const address = accounts[0]
  const tokenSymbol = 'FID'
  const tokenName = 'Fido Coin'
  const tokenDecimals = 18
  const tokenRate = 1000000000000000000
  const tokenInitialSupply = 1000000000000

  before(async () => (
    { contract } = await fidelityPoints.deployed(),
    { methods } = contract,
    { events } = new web3.eth.Contract(
      contract._jsonInterface,
      contract._address
    )
  ))

  it('deploys a FidelityPoints contract', () => {

  })

  it('marks deployer as the contract owner', async () => {
    const owner = await contract.owner.call();
    assert.strictEqual(
      accounts[0],
      owner,
      'Contract owner was not set correctly'
    )
  })

  it('checks token symbol', async () => {
    const symbol = await contract.symbol.call()
    assert.strictEqual(
      symbol,
      tokenSymbol,
      'Token symbol was not set correctly'
    )
  })

  it('checks token name', async () => {
    const name = await contract.name.call()
    assert.strictEqual(
      name,
      tokenName,
      'Token name was not set correctly'
    )
  })

  it('checks token decimals', async () => {
    const decimals = await contract.decimals.call()
    assert.strictEqual(
      parseInt(decimals),
      tokenDecimals,
      'Token decimals was not set correctly'
    )
  })

  it('checks token RATE', async () => {
    const RATE = await contract.RATE.call()
    assert.strictEqual(
      parseInt(RATE),
      tokenRate,
      'Token rate was not set correctly'
    )
  })

  it('checks token INITIAL_SUPPLY', async () => {
    const INITIAL_SUPPLY = await contract.INITIAL_SUPPLY.call()
    assert.strictEqual(
      parseInt(INITIAL_SUPPLY),
      tokenInitialSupply,
      'Token total supply was not set correctly'
    )
  })

  it('create tokens', async () => {
    console.log(accounts[0])
    let balanceFinal
    let balanceStart = await contract.balanceOf(accounts[0])
    balanceStart = parseFloat(balanceStart)
    console.log(balanceStart)
    try {
      await contract.createTokens().send({
        from: accounts[0],
        value: '1'
      })
      balanceFinal = await contract.balanceOf(accounts[0])
      balanceFinal = parseFloat(balanceFinal)
      console.log(balanceFinal)
      assert(balanceFinal > balanceStart)
    } catch (err) {
      console.log(err)
      assert.fail(err)
    }
  })

  // /*
  // * start total supply:            1000000000.
  // * final total supply:   2000000001000000000.
  // * */
  // it('totalSupply increment with token creation', async () => {
  //     let totalSupplyStart;
  //     let totalSupplyFinal;
  //     try {
  //         totalSupplyStart = await fidelityPoints.methods.totalSupply().call();
  //         await fidelityPoints.methods.createTokens().send({
  //             value: '2',
  //             from: accounts[0]
  //         });
  //         totalSupplyFinal = await fidelityPoints.methods.totalSupply().call();
  //         assert(totalSupplyFinal>totalSupplyStart);

  //     } catch (err) {
  //         assert.fail(err);
  //     }
  // });

  // it('only manager can create new tokens', async () => {
  //     let balance = await fidelityPoints.methods.balanceOf(accounts[1]).call();
  //     balance = parseFloat(balance);
  //     console.log("starting balance: " + balance);

  //     try {
  //         await fidelityPoints.methods.createTokens().send({
  //             value: '20',
  //             from: accounts[1]
  //         });
  //     } catch (err) {
  //         balance = await fidelityPoints.methods.balanceOf(accounts[1]).call();
  //         balance = parseFloat(balance);
  //         console.log("after catch() balance: " + balance);
  //         assert(balance == 0);
  //     }
  // });

  // it('getSummary', async () => {
  //     try {
  //         const summary = await fidelityPoints.methods.getSummary().call();
  //         console.log("summary[0]: " + summary[0]);
  //         console.log("summary[1]: " + summary[1]);
  //         console.log("summary[2]: " + summary[2]);
  //         console.log("summary[3]: " + summary[3]);
  //         console.log("summary[4]: " + summary[4]);
  //         assert(summary[4],"FIDO");
  //     } catch (err) {
  //         assert.fail(err);
  //     }
  // });

  // it('Should have logged event...', async () => {
  //   const {
  //     returnValues: {
  //       description
  //     }
  //   } = await waitForEvent(events.LogNewOraclizeQuery)
  //   assert.strictEqual(
  //     description,
  //     'event print',
  //     'Oraclize query incorrectly logged!'
  //   )
  // })

  // it('Should revert on...', async () => {
  //   const expErr = 'Transaction has been reverted'
  //   try {
  //     await methods
  //       .update()
  //       .send({
  //         from: address,
  //         gas: gasAmt
  //       })
  //     assert.fail('Update transaction should not have succeeded!')
  //   } catch (e) {
  //     assert.isTrue(
  //       e.message.startsWith(`${expErr}`),
  //       `Expected ${expErr} but got ${e.message} instead!`
  //     )
  //   }
  // })
})

