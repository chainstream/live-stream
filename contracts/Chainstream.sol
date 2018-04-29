pragma solidity ^0.4.21;

contract Chainstream {
	uint public streamPrice = 1 ether;

	event StopStream();
	event ContinueStream();
	event Tip(address Streamer);

	modifier sufficientFunds {
		if (msg.value < streamPrice) {
			emit StopStream();
		}
		_;
	}
	
	function updateStream(address recipient) public payable sufficientFunds {
		require(msg.value == streamPrice);  // caller doesn't overpay
		recipient.transfer(msg.value);
		emit ContinueStream();
	}

	function sendTip(address recipient) public payable {
		recipient.transfer(msg.value);
		emit Tip(recipient);
	}
}