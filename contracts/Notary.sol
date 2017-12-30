pragma solidity ^0.4.4;

contract Notary {

		uint[0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF] public AllHashes;
		address[0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF] public AllOwners;


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
				AllOwners[hash] = msg.sender;
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
		//Return the date for a hash at a given point.
		function getOwnerAt(uint256 hash) public view returns (address){
			return AllOwners[hash];
		}

}
