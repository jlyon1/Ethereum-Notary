var App = {
  web3Provider: null,
  contracts: {},

  init: function(){
    console.log((new Date()).getTime());
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
      document.getElementById('Submit-Hash-modal').style.display="block";
    });
    $(document).on('click', '.btn-check', function(){
      document.getElementById('Check-Hash-modal').style.display="block";
    });
    $(document).on('click', '.btn-submitHash-check', function(){
      web3.eth.getAccounts(function(error,accounts){
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        App.contracts.Notary.deployed().then(function(instance) {
          contractInstance = instance;
          //console.log(contractInstance.getHashAt.call());

          return contractInstance.getHashAt.call(parseInt("0x" + $(".hashCheckBox").val()));
        }).then(function(strs){
          document.getElementById('Submit-Hash-modal').style.display="none";
          for(var i = 0; i < 100; i ++);
          document.getElementById('Confirm-Hash-modal').style.display="block";
          if(strs['c'][0] == 0){
            $(".confirmation-message").html("<b>No Record found of this document</b>");
            $(".iconDisplay").html("<i class='fa fa-times' style='color:#e74c3c; font-size:124px;'></i>");
          }else{
            $(".confirmation-message").html("<b>This document hash was recorded on </b>" + (new Date(strs['c'][0])).toString());
            $(".iconDisplay").html("<i class='fa fa-file' style='color:#2ecc71; font-size:124px;'></i>");

          }

        }).catch(function(err) {
          console.log(err.message);
        });
      });
    });
    $(document).on('click', '.close', function(){
      document.getElementById('Submit-Hash-modal').style.display="none";
      document.getElementById('Check-Hash-modal').style.display="none";
      document.getElementById('Confirm-Hash-modal').style.display="none ";


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
        return contractInstance.storeHash(val,(new Date()).getTime(), {from: account});
      }).then(function(val){
        console.log(val)
        document.getElementById('Submit-Hash-modal').style.display="block";

      }).catch(function(err) {
        document.getElementById('Confirm-Hash-modal').style.display="block";
        $(".confirmation-message").html("Error Could not add hash, maybe the document has already been added?");

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
