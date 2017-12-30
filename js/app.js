
var App = {
  web3Provider: null,
  contracts: {}

}

Vue.component("box",{
  template: `<div class="container">
    <div class="tile is-ancestor">
    <div class="tile is-parent">
    <div class="tile is-child box">
    <p class="title">Submit a Value</p>
    <p class="subtitle">Store the current time under the current hash/text</p>
    <div class="level is-center">
    <input class="input" v-model="val"></input><button class="button is-danger" @click=triggerSend>Send</button>
    </div>

    <div v-if="showStored" class="notification is-success has-text-centered">Stored: {{stored}}</div>
    <div v-if="showFailed" class="notification is-danger has-text-centered">The Value has already been stored</div>

    </div>
    </div>
    <div class="tile is-parent">
    <div class="tile is-child box">
    <p class="title">Retreive a Value</p>
    <p class="subtitle">See if a date has been stored on the blockchain</p>
    <div class="level is-center">
    <input class="input" v-model="checkVal"></input><button class="button is-success" @click=checkHash>Check</button>
    </div>

    <div v-if="showCheck" class="notification is-success has-text-centered">The Date this value was stored was: {{date}}</div>

    </div>
    </div>
    </div>
  </div>`,
  data (){
    return {
      val: "123456",
      checkVal: "123456",
      showStored: false,
      stored: "",
      showFailed: false,
      date: "",
      showCheck: false,

    }
  },
  methods: {
    triggerSend: function(){
      let el = this;
      date = new Date().getTime();
      web3.eth.getAccounts(function(error,accounts){
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        App.contracts.Notary.deployed().then(function(instance) {
          contractInstance = instance;
          return contractInstance.storeHash(el.val,(date),{from: account});
        }).then(function(val){
          el.showStored = true;
          el.stored = new Date(date);
          el.showFailed = false;
          el.showStored = true;
        }).catch(function(err) {
          el.showStored = false;
          el.showFailed = true;
        });
      });

    },
    checkHash: function(){
      let el = this;
      web3.eth.getAccounts(function(error,accounts){
        if (error) {
        }
        var account = accounts[0];
        App.contracts.Notary.deployed().then(function(instance) {
          contractInstance = instance;
          return contractInstance.getHashAt(el.checkVal);
        }).then(function(val){
          el.showCheck = true;
          el.date = new Date(val.c[0])
        }).catch(function(err) {
        });
      });

    }
  },
  mounted(){

  }

});

Vue.component("titlebar",{
  template: `<div class="section has-text-centered">
  <div class="container">
  <p class="title">
  EthNotary</p>
  <p class="subtitle">{{titleText}}</p>
  <p>Store a date on the blockchain using a document hash and retreive it later to prove you owned it in a certain state at a given time. Submitting a hash is a "stamp of ownership", you can also submit any value and so long as no one has stamped it before you can prove ownership.</p>
  <p>  Something not working right? Open an <a href="https://github.com/jlyon1/ethereum-notary/issues">Issue</a></p>
  </div>
  </div>`,
  data (){
    return{
      titleStyle: {position:"absolute",backgroundColor:"#eee",height:"34px",width:"auto",top:"1",left:"0",right:"0"},
      paragraphStyle: {float: "left",height:"34px",lineHeight:"34px",verticalAlign:"center",paddingLeft:"30px",margin:"0"},
      titleText: "The contract is not deployed yet, please check back",
      balance: 0,
    }
  },
  methods: {
    initWeb3: function(){
      // Initialize web3 and set the provider to the testRPC.
      if (typeof web3 !== 'undefined') {
        window.App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // set the provider you want from Web3.providers
        window.App.web3Provider = new web3.providers.HttpProvider('http://localhost:9545');
        web3 = new Web3(window.App.web3Provider);
      }
      return this.initContract();
    },
    initContract: function(){
      $.getJSON('Notary.json', function(data) {
        // Get the  contract artifact file and instantiate it with truffle-contract.
        var NotaryArtifact = data;
        window.App.contracts.Notary = TruffleContract(NotaryArtifact);
        window.App.contracts.Notary.setProvider(window.App.web3Provider);
        return 0;
      });
      return this.setBindings();
    },
    setBindings: function(){
      let el = this;
      web3.eth.getAccounts(function(error,accounts){
        App.contracts.Notary.deployed().then(function(instance) {
          contractInstance = instance;
          el.titleText = contractInstance.address;
          return contractInstance.getBal.call();
        }).then(function(ret){
          el.balance = ret;
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
