pragma solidity ^0.4.4;

//A simple smart contract to act as the back end for an ethereum notary,
//once document hashes are added they cannot be removed. or changed.
//This smart contract handles no other functions.

//I beleive the smart contract should be as simple as possile, with most of the
//heavy lifting done by the frontend. Feel free to use or modify any code as needed.


contract Notary {

		uint[0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF] public AllHashes;

		uint256 bal = 0;

		function () public payable{
			bal = msg.value;
		}

		function withdraw() public {
			msg.sender.transfer(this.balance);
		}

		function getBal() public view returns (uint256){
			return this.balance;
		}

		//Hashes of a document can only be added to the notary once, this way we can ensure
		//that you cannot overwrite the date for a given document.
		function storeHash(uint256 hash, uint val) public returns (uint){
			if(AllHashes[hash] == 0){
				AllHashes[hash] = val;
				return 1;
			}else{
				revert();
				return 0;
			}
		}

		//Return the date for a hash at a given point.
		function getHashAt(uint256 hash) public view returns (uint){
			return AllHashes[hash];
		}

}
