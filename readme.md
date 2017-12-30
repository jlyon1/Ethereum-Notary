# Ethereum Notary

A Simple notary running on the Ethereum Blockchain. Currently it is not deployed, and the current state of the project is non-functional.

## Implementation:
The data is stored on the blockchain in massive arrays, which are not modifiable, except to be set the first time, which ensures that it's state cannot be modified:

```
uint[0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF] public AllHashes;
```

Data is then retreivable from a web interface, or directly from interfacing with the smart contract.

### Todo:

- [ ] Deploy the contract on the test net
- [ ] More detailed description on website
- [ ] Finish todo list
