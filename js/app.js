var App = {
  web3Provider: null,
  contracts: {},

  init: function(){
    console.log("here");
    App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
   $.getJSON('Notary.json', function(data) {
     // Get the  contract artifact file and instantiate it with truffle-contract.
     var NotaryArtifact = data;
     App.contracts.Notary = TruffleContract(NotaryArtifact);

     App.contracts.Notary.setProvider(App.web3Provider);

     return 0;
   });
   return App.setBindings();
 },


  setBindings: function(){
    $(document).on('click', '.btn-hash', function(){
      document.getElementById('input_overlay').style.display="block";
    });
    $(document).on('click', '.btn-upload', function(){
      web3.eth.getAccounts(function(error,accounts){
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        App.contracts.Notary.deployed().then(function(instance) {
          contractInstance = instance;
          //console.log(contractInstance.getHashAt.call());

          return contractInstance.getHashAt.call(0x4e080f0d799b71a654d945e4cabf46a734caac436554b39841d1f9105bd36561);
        }).then(function(strs){
          console.log(strs);
        }).catch(function(err) {
          console.log(err.message);
        });
      });
    });
    $(document).on('click', '.close', function(){
      document.getElementById('input_overlay').style.display="none";
    });
    $(document).on('click','.btn-submitHash',function(){
      App.submitHash();
    });
  },

  submitHash: function(){
    web3.eth.getAccounts(function(error,accounts){
      if (error) {
        console.log(error);
      }
      var val = parseInt("0x" + $(".hashIn").val());
      var account = accounts[0];
      App.contracts.Notary.deployed().then(function(instance) {
        contractInstance = instance;
        return contractInstance.storeHash(val,1232, {from: account});
      }).then(function(val){
        console.log(val);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

}



$(function() {
  $(window).load(function() {
    App.init();
  });
});
