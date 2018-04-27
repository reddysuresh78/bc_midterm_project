grid = document.getElementById('grid');
msg = document.querySelector('.message');
chooser = document.querySelector('form');
mark= null;
cells = null;
cellValues = [];
winningSymbol = "";
App = {
  web3Provider: null,
  contracts: {},
  fromAccount : null,
  
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

      msg.textContent = 'Please pay your bet of 10 ETH! Computer has bet 10 ETH';

      App.startGame(); 

      // Use our contract to retrieve and mark currently selected cells 
      // return App.markCurrentState();
      return;
    });

    return App.bindEvents();
  },


  bindEvents: function () {

    mark = 'X';
    msg.textContent = 'Initializing....';
    App.buildGrid();
   
  },

  // build the grid
  buildGrid: function () {
    // console.log('buildgrid called');
    for (var i = 1; i <= 9; i++) {
      
      var cell = document.createElement('li');
      cell.id = 'c' + i;
      // $(document).on('click', cell, App.playerMove);
      cell.addEventListener('click', App.playerMove, false);
      grid.appendChild(cell);
    }
    cells = Array.prototype.slice.call(grid.getElementsByTagName('li'));

    
  },
 
  // add click listener to radio buttons
  setPlayer: function () {
    mark = this.value;
    msg.textContent = mark + ', click on a square to make your move!';
    chooser.classList.add('game-on');
    this.checked = false;
    App.buildGrid();
  },

      // determine a winner
  winner : function (a, b, c) {
    if (a.textContent == mark && b.textContent == mark && c.textContent == mark) {
      winningSymbol = mark;
      
      a.classList.add('winner');
      b.classList.add('winner');
      c.classList.add('winner');
      return true;
    } else {
      return false;
    }
  },

  // check cell combinations 
  checkRow : function () {
    var rowstatus1 = App.winner(document.getElementById('c1'), document.getElementById('c2'), document.getElementById('c3'));
    var rowstatus2 = App.winner(document.getElementById('c4'), document.getElementById('c5'), document.getElementById('c6'));
    var rowstatus3 = App.winner(document.getElementById('c7'), document.getElementById('c8'), document.getElementById('c9'));
    var colstatus1 = App.winner(document.getElementById('c1'), document.getElementById('c4'), document.getElementById('c7'));
    var colstatus2 = App.winner(document.getElementById('c2'), document.getElementById('c5'), document.getElementById('c8'));
    var colstatus3 = App.winner(document.getElementById('c3'), document.getElementById('c6'), document.getElementById('c9'));
    var diagstatus1 = App.winner(document.getElementById('c1'), document.getElementById('c5'), document.getElementById('c9'));
    var diagstatus2 = App.winner(document.getElementById('c3'), document.getElementById('c5'), document.getElementById('c7'));

    if(rowstatus1 || rowstatus2 || rowstatus3 || colstatus1 || colstatus2 || colstatus3 || diagstatus1 || diagstatus2){
      return true;
    }
    return false;
  } ,
  
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
    // console.log(random);
    if (random >= 0) {
      emptyCells[random].textContent = mark;
    }
    if (App.isGameOver()) {
       console.log("Game is over");
       App.payToWinner();
    } 

    App.switchMark();
  },

  isGameOver: function() {
    return App.checkRow();
    // return false;
  },


  // add click listener to each cell
  playerMove: function () {
     if (this.textContent == '') {
      this.textContent = mark;

      gameOver = false;
      //Call server
      // App.handleMove(this.id);

      if (App.isGameOver()) {
        console.log("Game is over");
        App.payToWinner();
      } else {
        App.switchMark();
        App.computerMove();
      }
    }
  },

  startGame: function(){
    var ticTacToeInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      fromAccount = accounts[0];
   
      App.contracts.TicTacToe.deployed().then(function (instance) {
        ticTacToeInstance = instance;

        return ticTacToeInstance.startGame( { from: fromAccount, value: 10000000000000000000 });
      }).then(function (result) {
         console.log('Payment successful. Starting game now');
         msg.textContent = 'Payment successful. Please click on a square to make your move!';
        }).catch(function (err) {
          console.log(err.message);
      });
    });
  },

  payToWinner: function () {

    var grid = [[],[],[]];
    for (var i = 1; i <= 9; i++) {
      var cellName = 'c' + i;
      var cell = document.getElementById(cellName);

      var val = cell.textContent == 'X' ? 0 :1 ;
      
      var x = Math.floor((i-1) / 3);
      var y = (i-1) % 3;

      grid[x][y] = val;
    }

    winningSym = (winningSymbol == 'X') ? 0 :1 ;

    msg.textContent = (mark == 'X' ? 'You are' :' Computer is ') + ' the winner! Please approve the payment.';
 
    var ticTacToeInstance;

    App.contracts.TicTacToe.deployed().then(function (instance) {
      ticTacToeInstance = instance;

      return ticTacToeInstance.payToWinner( grid , winningSym, { from: fromAccount, gas: 5000000,  gasLimit: 5000000, gasPrice: 2000000000 } );
    }).then(function (result) {
      console.log('setBoxValue called successfully ' + result);
      msg.textContent = 'Payment successful. Thanks for playing.';
    }).catch(function (err) {
      console.log('Error occurred while setting value ' + err.message);
    });
  }
}; 

$(function () {
  $(window).load(function () {
    App.init();
  });
});


