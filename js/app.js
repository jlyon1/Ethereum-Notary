
var App = {
  web3Provider: null,
  contracts: {}

}

Vue.component("titlebar",{
  template: `<div v-bind:style=titleStyle><p v-bind:style=paragraphStyle>{{titleText}}</p></div>`,
  data (){
    return{
      titleStyle: {position:"absolute",backgroundColor:"#eee",height:"34px",width:"auto",top:"1",left:"0",right:"0"},
      paragraphStyle: {float: "left",height:"34px",lineHeight:"34px",verticalAlign:"center",paddingLeft:"30px",margin:"0"},
      titleText: "EthNotary"
    }
  },
  methods: {
    initWeb3: function(){
      // Initialize web3 and set the provider to the testRPC.
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // set the provider you want from Web3.providers
        App.web3Provider = new web3.providers.HttpProvider('http://localhost:9545');
        web3 = new Web3(App.web3Provider);
      }
      return this.initContract();
    },
    initContract: function(){
      $.getJSON('Notary.json', function(data) {
        // Get the  contract artifact file and instantiate it with truffle-contract.
        var NotaryArtifact = data;
        App.contracts.Notary = TruffleContract(NotaryArtifact);

        App.contracts.Notary.setProvider(App.web3Provider);
        return 0;
      });
      return this.setBindings();
    },
    setBindings: function(){
      web3.eth.getAccounts(function(error,accounts){
        App.contracts.Notary.deployed().then(function(instance) {
          contractInstance = instance;
          console.log(contractInstance.address);
        });
      });
    }
  },
  mounted(){
    this.initWeb3();

  }

});

var Application = new Vue({
  el: '#app-vue',
  data: {
  },


});

var App = {
  web3Provider: null,
  contracts: {},

  init: function(){
    App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:9545');
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
    web3.eth.getAccounts(function(error,accounts){
      App.contracts.Notary.deployed().then(function(instance) {
        contractInstance = instance;
        console.log(contractInstance.address);
      });
    });
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
          console.log(contractInstance.address);

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
