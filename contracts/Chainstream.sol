pragma solidity ^0.4.21;

contract Chainstream {
	uint public streamPrice = 1 ether;

	event stopStream();
	event continueStream();

	modifier sufficientFunds {
		if (msg.value < streamPrice) {
			emit stopStream();
		}
		_;
	}
	function updateStream() public payable sufficientFunds {
		require(msg.value == streamPrice);  // caller doesn't overpay
		emit continueStream();
	}
}