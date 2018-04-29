const Chainstream = artifacts.require('./Chainstream.sol');

const weiToEther = 10 ** 18;

// injected from web3.eth.accounts
// {from: account[0] } unless explicitly specified
contract('Chainstream', accounts => {
  const ADMIN = accounts[0];

  it('returns correct event types', async () => {
    const instance = await Chainstream.deployed();
    const streamPrice = await instance.streamPrice();
    assert.equal(streamPrice, weiToEther);

    const receipt = await instance.updateStream({from: ADMIN, value: weiToEther});
    assert(receipt.logs[0].event, 'continueStream', 'continues streaming after payment');

    instance.updateStream({from: ADMIN, value: 1})
      .then(assert.fail)
      .catch(error => assert(error.message.includes('revert')));
  })

})