const Chainstream = artifacts.require('./Chainstream.sol');

const ethToWei = (amount=1) => amount * 10 ** 18;

// injected from web3.eth.accounts
// {from: account[0] } unless explicitly specified
contract('Chainstream', accounts => {
  const ADMIN = accounts[0];
  const VIEWER = accounts[1];
  const STREAMER = accounts[2];

  it('returns correct event types', async () => {
    const instance = await Chainstream.deployed();
    const streamPrice = await instance.streamPrice();
    assert.equal(streamPrice, ethToWei());

    const receipt = await instance.updateStream(STREAMER, {from: VIEWER, value: ethToWei()});
    assert(receipt.logs[0].event, 'continueStream', 'continues streaming after payment');

    instance.updateStream({from: ADMIN, value: 1})
      .then(assert.fail)
      .catch(error => assert(error.message.includes('revert')));

    await instance.sendTip(STREAMER, {from: VIEWER, value: ethToWei(10)});
    console.log();
  })

})