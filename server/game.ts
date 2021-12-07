type Position = {
    x: number,
    y: number
}

enum BoardStateValues {
    empty = "E",
    treasure = "T",
    player1 = "1",
    player2 = "2",
    rock = "R",
    unknown = "U"
}

export class Board {
    state: Array<Array<string>>;
    boardSize = 10;

    player1Pos: Position;
    player2Pos: Position;

    constructor() {
        this.state = new Array(10);
        for (let i = 0; i < this.boardSize; i++) {
            this.state[i] = new Array(10);
        }

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (Math.random() > 0.8) {
                    this.state[i][j] = BoardStateValues.rock;
                } else {
                    this.state[i][j] = BoardStateValues.empty;
                }
            }
        }

        this.state[Math.floor(Math.random() * 10)][Math.floor(Math.random() * 10)] = BoardStateValues.treasure;

        this.state[0][this.boardSize - 1] = BoardStateValues.player1;
        this.state[this.boardSize - 1][0] = BoardStateValues.player2;

        this.player1Pos = { x: 0, y: 9 };
        this.player2Pos = { x: 9, y: 0 };
    }

    obscureBoard(player: number) {
        let newBoard = JSON.parse(JSON.stringify(this.state));

        if (player == 1) {
            for (let i = 0; i < this.boardSize; i++) {
                for (let j = 0; j < this.boardSize; j++) {
                    if (newBoard[i][j] != BoardStateValues.player1) {
                        newBoard[i][j] = BoardStateValues.unknown;
                    } else {
                        newBoard[i][j] = BoardStateValues.player1;
                    }
                }
            }

            return newBoard;
        } else if (player == 2) {
            for (let i = 0; i < this.boardSize; i++) {
                for (let j = 0; j < this.boardSize; j++) {
                    if (newBoard[i][j] != BoardStateValues.player2) {
                        newBoard[i][j] = BoardStateValues.unknown;
                    }
                }
            }

            return newBoard;
        }
    }

    printBoard() {
        this.state.forEach((row) => {
            let output = "";

            row.map((item) => {
                output = output.concat(item);
            });
            console.log(output);
        });
    }

    SerializeBoard() {
        return this.state;
    }

    checkMove(coords: Position, player: number): Position {
        let returnPosition = undefined;
        switch (this.state[coords.x][coords.y]) {
            case BoardStateValues.player1:
            case BoardStateValues.player2:
            case BoardStateValues.rock:
                console.log("Square is occupied.");
                //window.alert("Square is occupied. Cannot make move");
                //send space ocupied message
    
                break;
            case BoardStateValues.treasure:
                console.log("Treasure found");
                //end game
                break;
            //case BoardStateValues.unknown:
            case BoardStateValues.empty:
                console.log("Square is free. Move to square");
                //move player sprite
                if(player == 1){
                    this.state[this.player1Pos.x][this.player1Pos.y] = BoardStateValues.empty;
                    this.player1Pos.x = coords.x;
                    this.player1Pos.y = coords.y;
                    this.state[coords.x][coords.y] = BoardStateValues.player1;
                    console.log(this.state);
                }
                else if (player == 2)
                {
                    this.state[this.player2Pos.x][this.player2Pos.y] = BoardStateValues.empty;
                    this.player2Pos.x = coords.x;
                    this.player2Pos.y = coords.y;
                    this.state[coords.x][coords.y] = BoardStateValues.player2;
                }
                break;
            default:
                console.log("Something is terribly wrong we have falled out of the switch");
        }

        if (player == 1) {
            return this.player1Pos;
        } else if (player == 2) {
            return this.player2Pos;
        } else {
            return { x: -1, y: -1 }; //we should never hit here if we do panic your missing your player
        }
    }

    useLight(playerDirection: string, player: number, playerObscuredBoard: Array<Array<string>>) {
        //Starts light one square away from player to avoid collision on current location
        let x = 1;
        let playerLocation: Position = {x: -1, y: -1};

        if (player == 1) {
            playerLocation = this.player1Pos;
        } else if (player == 2) {
            playerLocation = this.player2Pos;
        }

        switch (playerDirection) {
            case "N":
                //case for board edge
                if(playerLocation.x - x < 0){
                    console.log("At edge of board. Cannot go North to uncover anything!");
                    break;
                }

                while (!(playerLocation.x - x < 0) || this.state[playerLocation.x - x][playerLocation.y] != BoardStateValues.player1 || this.state[playerLocation.x - x][playerLocation.y] != BoardStateValues.player2 || this.state[playerLocation.x - x][playerLocation.y] != BoardStateValues.rock) {
                    //mutate the player obscured board based on the information located in this.state
                    if(this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.rock)
                    {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = BoardStateValues.rock;
                        break;
                    }
                    else if(this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.treasure)
                    {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = BoardStateValues.treasure;
                        break;
                    }
                    else
                    {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = this.state[playerLocation.x - x][playerLocation.y]; //this is the "uncovering"
                        x++;
                    }
                }

                break;
            case "S":
                //case for board edge
                if(playerLocation.x + x > 9){
                    console.log("At edge of board. Cannot go South to uncover anything!");
                    break;
                }

                while (!(playerLocation.y > 9) || this.state[playerLocation.x + x][playerLocation.y] != BoardStateValues.player1 || this.state[playerLocation.x + x][playerLocation.y] != BoardStateValues.player2 || this.state[playerLocation.x + x][playerLocation.y] != BoardStateValues.rock) {
                    //mutate the player obscured board based on the information located in this.state
                    if(this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.rock)
                    {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = BoardStateValues.rock;
                        break;
                    }
                    else if(this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.treasure)
                    {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = BoardStateValues.treasure;
                        break;
                    }
                    else
                    {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = this.state[playerLocation.x + x][playerLocation.y]; //this is the "uncovering"
                        x++;
                    }
                }

                break;
            case "E":
                //case for board edge
                if(playerLocation.y + x > 9){
                    console.log("At edge of board. Cannot go East to uncover anything!");
                    break;
                }

                while (!(playerLocation.y + x > 9) || this.state[playerLocation.x][playerLocation.y + x] != BoardStateValues.player1 || this.state[playerLocation.x][playerLocation.y + x] != BoardStateValues.player2 || this.state[playerLocation.x][playerLocation.y + x] != BoardStateValues.rock) {
                    //mutate the player obscured board based on the information located in this.state
                    if(this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.rock)
                    {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = BoardStateValues.rock;
                        break;
                    }
                    else if(this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.treasure)
                    {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = BoardStateValues.treasure;
                        break;
                    }
                    else
                    {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = this.state[playerLocation.x][playerLocation.y + x]; //this is the "uncovering"
                        x++;
                    }
                }
                
                break;
            case "W":
                //case for board edge
                if(playerLocation.y - x < 0){
                    console.log("At edge of board. Cannot go West to uncover anything!");
                    break;
                }

                while (!(playerLocation.y < 0) || this.state[playerLocation.x][playerLocation.y - x] != BoardStateValues.player1 || this.state[playerLocation.x][playerLocation.y - x] != BoardStateValues.player2 || this.state[playerLocation.x][playerLocation.y - x] != BoardStateValues.rock) {
                    //mutate the player obscured board based on the information located in this.state
                    if(this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.rock)
                    {
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = BoardStateValues.rock;
                        break;
                    }
                    else if(this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.treasure)
                    {
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = BoardStateValues.treasure;
                        break;
                    }
                    else
                    {
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = this.state[playerLocation.x][playerLocation.y - x]; //this is the "uncovering"
                        x++;
                    }
                }

                break;
            default:
                console.log("Something terribly went wrong");
        }

        return playerObscuredBoard; //return the now updated board;
    }
}

export function MakeMove(targetPosition: Position, currentBoard: Board, playerObscuredBoard: Array<Array<string>>, player: number) {
    

    if (player == 1) {
        playerObscuredBoard[currentBoard.player1Pos.x][currentBoard.player1Pos.y] = BoardStateValues.empty;
    } else if (player == 2) {
        playerObscuredBoard[currentBoard.player2Pos.x][currentBoard.player2Pos.y] = BoardStateValues.empty;
    }

    let newPosition = currentBoard.checkMove(targetPosition, player);

    console.log(`you are ${player} moving to ${targetPosition}`);

    if (player == 1) {
        playerObscuredBoard[currentBoard.player1Pos.x][currentBoard.player1Pos.y] = BoardStateValues.player1;
    } else if (player == 2) {
        playerObscuredBoard[currentBoard.player2Pos.x][currentBoard.player2Pos.y] = BoardStateValues.player2;
    }

    return playerObscuredBoard;
}

export function playerUseLight(targetDirection: string, currentBoard: Board, playerObscuredBoard: Array<Array<string>>, player: number) {
    playerObscuredBoard = currentBoard.useLight(targetDirection, player, playerObscuredBoard);
    
    return playerObscuredBoard;
}