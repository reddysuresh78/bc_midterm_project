pragma solidity ^0.4.21;

contract TicTacToe {
     
    /* 
        prize money in case someone wins 
    */
    uint constant MIN_BET_MONEY = 5;

    
    // Player's Symbol
    uint8 constant PLAYER_SYMBOL = 0;

    /* 
        The grid of boxes to indicate the current 
        filled and empty boxes. A value of  
        -1  means no player has selected (filled) this box.
        0 means player 
        1 means computer 

        Here the type is chosen as integer because the string arrays 
        are not supported yet to be parameters or return values of a contract
    */
    int[3][3] public gameGrid;
  
    // This stores the address of the owner of the game. If player looses, this address gets money. 
    address public gameOwner;

    // This stores the address of player of the game. If player wins, this address gets money. 
    address public player; 

    // Current Balance in the contract
    uint public balance;

    // Game status
    bool public gameOver = false;
   
    /* 
        A public constructor that will initialize the contract 
        with the money from gameowner.

        This also initialize the game grid with all -1 (not filled) 
    */
    constructor() public payable {

        gameOwner = msg.sender;

        require(msg.value >= MIN_BET_MONEY);

        balance = msg.value;

        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                gameGrid[i][j] = -1;     
            }
        }
    }

    /* 
        Start the game when the player sends ether to contract 
        Whoever wins gets all the money stored in contract
    */
    function startGame() public payable {

        require(msg.value >= MIN_BET_MONEY);

        player = msg.sender;
        balance += msg.value;
    }
 
    function payToWinner(int[3][3] newGrid, int winningSymbol ) public returns(bool) {
        
        gameGrid = newGrid;
        address winner = ( winningSymbol == PLAYER_SYMBOL ) ? player : gameOwner;
        winner.transfer( balance );

        return true;
    }
    
    /* 
        Returns the whole grid  so that it can be used in UI
    */
   function getGameGrid() public view returns(int[3][3] ) {
       
        return gameGrid;
    }

      
    
}