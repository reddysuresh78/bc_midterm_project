var grid = document.getElementById('grid');
    var msg = document.querySelector('.message');
    var chooser = document.querySelector('form');
    var mark;
    var cells;
    
    // add click listener to radio buttons
    function setPlayer() {
      mark = this.value;
      msg.textContent = mark + ', click on a square to make your move!';
      chooser.classList.add('game-on');
      this.checked = false;
      buildGrid();
    }
    
    // add click listener to each cell
    function playerMove() {
      if (this.textContent == '') {
        this.textContent = mark;
        checkRow();
        switchMark();
        computerMove();
      }
    }
    
    // let the computer make the next move
    function computerMove() {
      var emptyCells = [];
      var random;
    
    /*  for (var i = 0; i < cells.length; i++) {
        if (cells[i].textContent == '') {
          emptyCells.push(cells[i]);
        }
      }*/
      
      cells.forEach(function(cell){
        if (cell.textContent == '') {
          emptyCells.push(cell);
        }
      });
      
      // computer marks a random EMPTY cell
      random = Math.ceil(Math.random() * emptyCells.length) - 1;
      console.log(random);
      if(random >= 0) {
        emptyCells[random].textContent = mark;
    }
      checkRow();
      switchMark();
    }
    
    // switch player mark
    function switchMark() {
      if (mark == 'X') {
        mark = 'O';
      } else {
        mark = 'X';
      }
    }
    
    // determine a winner
    function winner(a, b, c) {
      if (a.textContent == mark && b.textContent == mark && c.textContent == mark) {
        msg.textContent = mark + ' is the winner!';
        a.classList.add('winner');
        b.classList.add('winner');
        c.classList.add('winner');
        return true;
      } else {
        return false;
      }
    }
    
    // check cell combinations 
    function checkRow() {
      var rowstatus1 = winner(document.getElementById('c1'), document.getElementById('c2'), document.getElementById('c3'));
      var rowstatus2 =winner(document.getElementById('c4'), document.getElementById('c5'), document.getElementById('c6'));
      var rowstatus3 = winner(document.getElementById('c7'), document.getElementById('c8'), document.getElementById('c9'));
      var colstatus1 = winner(document.getElementById('c1'), document.getElementById('c4'), document.getElementById('c7'));
      var colstatus2 = winner(document.getElementById('c2'), document.getElementById('c5'), document.getElementById('c8'));
      var colstatus3 = winner(document.getElementById('c3'), document.getElementById('c6'), document.getElementById('c9'));
      var diagstatus1 = winner(document.getElementById('c1'), document.getElementById('c5'), document.getElementById('c9'));
      var diagstatus2 = winner(document.getElementById('c3'), document.getElementById('c5'), document.getElementById('c7'));

      if(rowstatus1 || rowstatus2 || rowstatus3 || colstatus1 || colstatus2 || colstatus3 || diagstatus1 || diagstatus2){
        return true;
      }
      return false;
    }
    
    // clear the grid
    function resetGrid() {
      mark = 'X';
     /* for (var i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
        cells[i].classList.remove('winner');
      }*/
      cells.forEach(function(cell){
        cell.textContent = '';
        cell.classList.remove('winner');
      });
      msg.textContent = 'Choose your player:';
      chooser.classList.remove('game-on');
      grid.innerHTML = '';
    }
    
    // build the grid
    function buildGrid() {
      for (var i = 1; i <= 9; i++) 
      {
          
        var cell = document.createElement('li');
        cell.id = 'c' + i;
        cell.addEventListener('click', playerMove, false);
        grid.appendChild(cell);
      }
     
    
      /* cells = document.querySelectorAll('li'); //Returns a NodeList, not an Array
      See https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches */
      cells = Array.prototype.slice.call(grid.getElementsByTagName('li'));
    }
    
    var players = Array.prototype.slice.call(document.querySelectorAll('input[name=player-choice]'));
    players.forEach(function(choice){
      choice.addEventListener('click', setPlayer, false);
    });
    
    var resetButton = chooser.querySelector('button');
    resetButton.addEventListener('click', function(e) {
      e.preventDefault();
      resetGrid();
    });