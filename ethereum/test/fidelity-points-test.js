const {
  waitForEvent,
  getExternalVariable
} = require('./utils')

const Web3 = require('web3')
const randomExample = artifacts.require('./FidelityPoints.sol')
//const RINKEBY_WSS = `wss://rinkeby.infura.io/ws/v3/${getExternalVariable('infuraKey')}`
const KOVAN_WSS = `wss://kovan.infura.io/ws/v3/${getExternalVariable('infuraKey')}`
const web3Socket = new Web3(new Web3.providers.WebsocketProvider(KOVAN_WSS))

contract('Fidelity Points Tests', async accounts => {

  const gasAmt = 3e6
  const address = accounts[0]

  before(async () => (
    { contract } = await randomExample.deployed(),
    { methods } = contract,
    { events } = new web3Socket.eth.Contract(
      contract._jsonInterface,
      contract._address
    )
  ))

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

