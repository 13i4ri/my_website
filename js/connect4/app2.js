class GameModel{
    constructor(){
        this.playerMoves = [];
        this.turn = 0;
        this.player2Moves = [];
        this.allMoves = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,
                         27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42];
        this.winningCombos = [
            [1, 2, 3, 4],
            [42, 41, 40, 39],
            [8, 9, 10, 11],
            [35, 34, 33, 32],
            [15, 16, 17, 18],
            [28, 27, 26, 25],
            [22, 23, 24, 25],
            [21, 20, 19, 18],
            [29, 30, 31, 32],
            [14, 13, 12, 11],
            [36, 37, 38, 39],
            [7, 6, 5, 4],
            [1, 8, 15, 22],
            [42, 35, 28, 21],
            [2, 9, 16, 23],
            [41, 34, 27, 20],
            [3, 10, 17, 24],
            [40, 33, 26, 19],
            [4, 11, 18, 25],
            [39, 32, 25, 18],
            [5, 12, 19, 26],
            [38, 31, 24, 17],
            [6, 13, 20, 27],
            [37, 30, 23, 16],
            [7, 14, 21, 28],
            [36, 29, 22, 15],
            [1, 9, 17, 25],
            [42, 34, 26, 18],
            [8, 16, 24, 32],
            [35, 27, 19, 11],
            [15, 23, 31, 39],
            [28, 20, 12, 4],
            [36, 30, 24, 18],
            [7, 13, 19, 25],
            [29, 23, 17, 11],
            [14, 20, 26, 32],
            [22, 16, 10, 4],
            [21, 27, 33, 39],
            [37, 31, 25, 19],
            [6, 12, 18, 24],
            [38, 32, 26, 20],
            [5, 11, 17, 23],
            [3, 11, 19, 27],
            [40, 32, 24, 16],
            [2, 10, 18, 26],
            [41, 33, 25, 17],
            [10, 18, 26, 34],
            [9, 17, 25, 33],
            [12, 18, 24, 30],
            [13, 19, 25, 31],
            [2, 3, 4, 5],
            [6, 5, 4, 3],
            [9, 10, 11, 12],
            [13, 12, 11, 10],
            [16, 17, 18, 19],
            [20, 19, 18, 17],
            [23, 24, 25, 26],
            [27, 26, 25, 24],
            [30, 31, 32, 33],
            [34, 33, 32, 31],
            [37, 38, 39, 40],
            [41, 40, 39, 38],
            [8, 15, 22, 29],
            [9, 16, 23, 30],
            [10, 17, 24, 31],
            [11, 18, 25, 32],
            [12, 19, 26, 33],
            [13, 20, 27, 34],
            [14, 21, 28, 35],
        ];
        this.didWin = false;     
    }


    playRound(playerPlay){
        if(!this.didWin){
        if (!this.player2Moves.includes(playerPlay) && !this.playerMoves.includes(playerPlay)){
            let availableMoves = [];
            for(let i = 0; i< this.allMoves.length; i++){
                if (!this.playerMoves.includes(this.allMoves[i]) &&
                    !this.player2Moves.includes(this.allMoves[i])) {
                        availableMoves.push(this.allMoves[i]);
                }
            }
            let availableModulo = [];
                if(playerPlay % 7 == 0){
                    for(let i = 7; i <= 42 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }else if(playerPlay % 7 == 1){
                    for(let i = 1; i <= 36 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 2){
                    for(let i = 2; i <= 37 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 3){
                    for(let i = 3; i <= 38 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 4){
                    for(let i = 4; i <= 39 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }else if(playerPlay % 7 == 5){
                    for(let i = 5; i <= 40 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 6){
                    for(let i = 6; i <= 41 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }

            if(this.turn % 2 == 0){
                if (availableModulo.length > 0) {
                    let pp = availableModulo.pop();
                    this.playerMoves.push(pp);
                    gameView.updatePlayer(pp);

                    let newAvMoves = [];
                    for(let i = 0; i< this.allMoves.length; i++){
                        if (!this.playerMoves.includes(this.allMoves[i]) &&
                            !this.player2Moves.includes(this.allMoves[i])) {
                                newAvMoves.push(this.allMoves[i]);
                        }
                    }
                    availableMoves = newAvMoves;
                    this.turn++;
                    
                    
                    let willblock = this.willblock();
                    let willWin = this.willWin();
                    let compmove ;
                    if(willWin && availableMoves.includes(willWin)){
                        compmove = willWin;
                    }else if(willblock && availableMoves.includes(willblock)){
                        compmove = willblock;
                    }else{
                        compmove = availableMoves[Math.floor(Math.random()*availableMoves.length)];
                    }
                    
                    this.computerPlay(compmove);
                }
            }
            
            this.checkWinner();
        } 
        }
    }

    computerPlay(playerPlay){
        
        if (!this.player2Moves.includes(playerPlay) && !this.playerMoves.includes(playerPlay)){
            
            let availableMoves = [];
            
            for(let i = 0; i< this.allMoves.length; i++){
                
                if (!this.playerMoves.includes(this.allMoves[i]) &&
                    !this.player2Moves.includes(this.allMoves[i])) {
                        
                        availableMoves.push(this.allMoves[i]);
                }
            }
            
            let availableModulo = [];
                if(playerPlay % 7 == 0){
                    for(let i = 7; i <= 42 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }else if(playerPlay % 7 == 1){
                    for(let i = 1; i <= 36 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 2){
                    for(let i = 2; i <= 37 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 3){
                    for(let i = 3; i <= 38 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 4){
                    for(let i = 4; i <= 39 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }else if(playerPlay % 7 == 5){
                    for(let i = 5; i <= 40 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
                else if(playerPlay % 7 == 6){
                    for(let i = 6; i <= 41 ; i+=7){
                        if(availableMoves.includes(i)){
                            availableModulo.push(i);
                        }
                    }
                }
            if(this.turn % 2 == 0){
            }else{
                if (availableModulo.length > 0) {
                    let pp = availableModulo.pop();
                    this.player2Moves.push(pp);
                    
                    gameView.updateComputer(pp);
                    this.turn++;
                }
            }
            this.checkWinner();

        } 
    }

    willblock(){
        
        for(let combo of this.winningCombos){
            let count = 0;
            let emptyspaceCount = 0;
            let emptyspace = null;
            for(let i of combo){
                if(this.playerMoves.includes(i)){
                    count++;
                }else if(!this.player2Moves.includes(i)){
                    emptyspaceCount++;
                    emptyspace = i;
                }
            }

            if(count == 3 && emptyspaceCount == 1){
                return emptyspace;
            }

        }
        return null;
    }
    willWin(){
        
        for(let combo of this.winningCombos){
            let count = 0;
            let emptyspace = null;
            for(let i of combo){
                if(this.player2Moves.includes(i)){
                    count++;
                }
            }

            if(count == 3){
                for(let i of combo){
                    if(!this.player2Moves.includes(i)){
                        emptyspace = i;break;
                    }
                }
                if(emptyspace){
                    return emptyspace;
                }
                
            }
            
        }
        return null;
    }

    
    checkWinner(){

        for(let combo of this.winningCombos){
            let player1 = 0;
            let player2 = 0;
            let comboCopy = combo;
            for(let i of combo){
                if(this.playerMoves.includes(i)){
                    player1++;
                }
                if(this.player2Moves.includes(i)){
                    player2++;
                }
            }
            if(player1 == 4){
                gameView.playerWon("red wins!");
                gameView.winnerCombo(comboCopy.pop());
                gameView.winnerCombo(comboCopy.pop());
                gameView.winnerCombo(comboCopy.pop());
                gameView.winnerCombo(comboCopy.pop());
                this.didWin = true;
                return true;
            }else if(player2 == 4){
                gameView.playerWon("blue wins!");
                gameView.winnerCombo(comboCopy.pop());
                gameView.winnerCombo(comboCopy.pop());
                gameView.winnerCombo(comboCopy.pop());
                gameView.winnerCombo(comboCopy.pop());
                this.didWin = true;
                return true;
            }
        }
        return false;
    }

    restart(){
        this.playerMoves = [];
        this.turn = 0;
        this.player2Moves = [];
        this.allMoves = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,
                         27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42];
        gameView.restart();
        this.didWin = false;
    }

}


const gameView = {
    updatePlayer: function(playerMove){
        const playerID = "c"+playerMove ;
        document.getElementById(playerID).style.backgroundColor = 'red';
        //document.getElementById(playerID).textContent = `x`;
    },
    updateComputer: function(computerMove){
        const computerId = "c"+computerMove;
        document.getElementById(computerId).style.backgroundColor = 'dodgerblue';
        //document.getElementById(String(computerMove)).textContent = '      ';
    },
    winnerCombo: function(move){
        document.getElementById(move).textContent = 'X';
    },
    playerWon: function(s){
        document.getElementById('winner').textContent = `${s}`;
    },
    showWinnerDIV: function(){
        document.getElementById('winnerDIV').hidden = false;
    },
    restart: function(){
        for(let i = 1; i <= 42;i++){
        document.getElementById("c"+String(i)).style.backgroundColor = 'bisque';
        document.getElementById(String(i)).textContent = '';
        }
        document.getElementById('winner').textContent = '';
        
        
    }
}


const gameController = {
    init: function(){
        this.model = new GameModel();
    },
    playRound(playerChoice){
        this.model.playRound(playerChoice);
    },
    restart: function(){
        this.model.restart();
    }
}


function playerMove(playerChoice){
    gameController.playRound(playerChoice);
    //gameController.checkWinner();
}

function restart(){
gameController.restart();
}

gameController.init();