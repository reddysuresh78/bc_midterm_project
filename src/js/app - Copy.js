grid = document.getElementById('grid');
msg = document.querySelector('.message');
chooser = document.querySelector('form');
mark= null;
cells = null;

App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    //Initialize 
    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      console.log('Connected to metamask version');
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      console.log('Connected to localhost 7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    

    $.getJSON('TicTacToe.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TicTacToeArtifact = data;
      App.contracts.TicTacToe = TruffleContract(TicTacToeArtifact);

      // Set the provider for our contract
      App.contracts.TicTacToe.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markCurrentState();
    });

    return App.bindEvents();
  },


  bindEvents: function () {

    mark = 'X';
    msg.textContent = 'Please click on a square to make your move!';
    App.buildGrid();

    // var players = Array.prototype.slice.call(document.querySelectorAll('input[name=player-choice]'));
    // players.forEach(function (choice) {
    //   choice.addEventListener('click',  App.setPlayer, false);
    //   // $(document).on('click', choice, App.setPlayer);
    //   // console.log('Event bound');
    // });


    // $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  // build the grid
  buildGrid: function () {
    console.log('buildgrid called');
    for (var i = 1; i <= 9; i++) {
      
      var cell = document.createElement('li');
      cell.id = 'c' + i;
      // $(document).on('click', cell, App.playerMove);
      cell.addEventListener('click', App.playerMove, false);
      grid.appendChild(cell);
    }
    cells = Array.prototype.slice.call(grid.getElementsByTagName('li'));
  },


  markCurrentState: function () {
    var ticTacToeInstance;

    App.contracts.TicTacToe.deployed().then(function (instance) {
      ticTacToeInstance = instance;

      return ticTacToeInstance.getTotalGrid.call();
    }).then(function (currentGrid) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  // add click listener to radio buttons
  setPlayer: function () {
    mark = this.value;
    msg.textContent = mark + ', click on a square to make your move!';
    chooser.classList.add('game-on');
    this.checked = false;
    App.buildGrid();
  },

  

  // switch player mark
  switchMark: function () {
    if (mark == 'X') {
      mark = 'O';
    } else {
      mark = 'X';
    }
  },

  // let the computer make the next move
  computerMove: function () {
    var emptyCells = [];
    var random;

    cells.forEach(function (cell) {
      if (cell.textContent == '') {
        emptyCells.push(cell);
      }
    });

    // computer marks a random EMPTY cell
    random = Math.ceil(Math.random() * emptyCells.length) - 1;
    console.log(random);
    if (random >= 0) {
      emptyCells[random].textContent = mark;
    }
    if (App.isGameOver()) {

    } 

    App.switchMark();
  },

  isGameOver: function() {

    return false;
  },


  // add click listener to each cell
  playerMove: function () {
    if (this.textContent == '') {
      this.textContent = mark;

      gameOver = false;
      //Call server
      
      if (App.isGameOver()) {

      } else {
        App.switchMark();
        App.computerMove();
      }
    }
  },


 



  handleAdopt: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, { from: account });
      }).then(function (result) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});


