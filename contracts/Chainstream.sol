pragma solidity ^0.4.21;

contract Chainstream {
	uint public streamPrice = 1 ether;

	address admin;
	mapping(address => uint) public bets;

	event StopStream();
	event ContinueStream();
	event Tip(address Streamer, uint value);

	function Chainstream() public {
		admin = msg.sender;
	}

	modifier onlyOwner {
		require(msg.sender == admin);
		_;
	}

	modifier sufficientFunds {
		if (msg.value < streamPrice) {
			emit StopStream();
		}
		_;
	}

	function setStreamPrice(uint price) public onlyOwner {
		streamPrice = price;
	}
	
	function updateStream(address recipient) public payable sufficientFunds {
		require(msg.value == streamPrice);  // caller doesn't overpay
		recipient.transfer(msg.value);
		emit ContinueStream();
	}

	function sendTip(address recipient) public payable {
		recipient.transfer(msg.value);
		emit Tip(recipient, msg.value);
	}

	function bet() public payable {
		bets[msg.sender] = msg.value;
	}

	function decideBet(address winner) public onlyOwner {
		winner.transfer(bets[winner]);
		bets[winner] = 0;
	}
}