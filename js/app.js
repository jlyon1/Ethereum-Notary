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
   $.getJSON('Adoption.json', function(data) {
     // Get the necessary contract artifact file and instantiate it with truffle-contract.
     var AdoptionArtifact = data;
     App.contracts.Adoption = TruffleContract(AdoptionArtifact);

     // Set the provider for our contract.
     App.contracts.Adoption.setProvider(App.web3Provider);

     // Use our contract to retieve and mark the adopted pets.
     return App.populate();
   });
   return App.setBindings();
 },


  setBindings: function(){
    $(document).on('click', '.btn-hash', function(){
      document.getElementById('input_overlay').style.display="block";
    });
    $(document).on('click', '.close', function(){
      document.getElementById('input_overlay').style.display="none";
    });
  }

}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
