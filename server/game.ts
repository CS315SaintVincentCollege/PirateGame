//Positions used for players
type Position = {
    x: number,
    y: number
}

//Values for divs on HTML page. Used to render sprites.
enum BoardStateValues {
    empty = "E",
    treasure = "T",
    player1 = "1",
    player2 = "2",
    rock = "R",
    unknown = "U"
}

//Class used for setting up board and rendering sprites in each div square.
//This class gets imported into the app.ts file.
export class Board {
    state: Array<Array<string>>;
    boardSize = 10;

    player1Pos: Position;
    player2Pos: Position;

    //Default constructor will set up board and generate states and corresponding sprites for 
    //each div square. 
    constructor() {
        this.state = new Array(10);
        for (let i = 0; i < this.boardSize; i++) {
            this.state[i] = new Array(10);
        }

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (Math.random() > 0.8) {
                    this.state[i][j] = BoardStateValues.rock; //Generate rock.
                } else {
                    this.state[i][j] = BoardStateValues.empty; //Leave square empty.
                }
            }
        }

        //Generate treaure. This will never generate on a player starting square.
        this.state[Math.floor(Math.random() * 8) + 1][Math.floor(Math.random() * 8) + 1] = BoardStateValues.treasure;

        //Generate players. They will always start in the same spot.
        this.state[0][this.boardSize - 1] = BoardStateValues.player1;
        this.state[this.boardSize - 1][0] = BoardStateValues.player2;

        //Set up player positions.
        this.player1Pos = { x: 0, y: 9 };
        this.player2Pos = { x: 9, y: 0 };
    }

    //Will take in a player number and create and return an obscured board for their instance.
    obscureBoard(player: number) {
        let newBoard = JSON.parse(JSON.stringify(this.state));

        //Obscure player 1 board. Only reveal player sprite.
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
        //Obscure player 2 board. Only reveal player sprite.
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

    //Will simply print out the current instance of a board.
    //Mostly used for debugging the state of the board.
    printBoard() {
        this.state.forEach((row) => {
            let output = "";

            row.map((item) => {
                output = output.concat(item);
            });
            console.log(output);
        });
    }

    //Just returns current state of the board.
    SerializeBoard() {
        return this.state;
    }


    //Will take in the clicked on position and player number.
    //If the move is valid, the player will either move there or not
    //move there. If they do move, the players new position is returned.
    checkMove(coords: Position, player: number, GameOn: any): Position {
        let returnPosition = undefined;

        //Look at desired move coordinates.
        switch (this.state[coords.x][coords.y]) {
            case BoardStateValues.player1:
            case BoardStateValues.player2:
            case BoardStateValues.rock:
                //The three above cases result in no move.
                break;
            case BoardStateValues.treasure:
                //With the treasure found set GameOn.foo to false to signal to app.ts that the game is over
                GameOn.foo = false;
                //end game
                break;
            case BoardStateValues.empty:
                //Player 1 Sprite Moves
                if (player == 1) {
                    this.state[this.player1Pos.x][this.player1Pos.y] = BoardStateValues.empty;
                    this.player1Pos.x = coords.x;
                    this.player1Pos.y = coords.y;
                    this.state[coords.x][coords.y] = BoardStateValues.player1;
                }
                //Player 2 Sprite Moves
                else if (player == 2) {
                    this.state[this.player2Pos.x][this.player2Pos.y] = BoardStateValues.empty;
                    this.player2Pos.x = coords.x;
                    this.player2Pos.y = coords.y;
                    this.state[coords.x][coords.y] = BoardStateValues.player2;
                }
                break;
            default:
                console.log("Something is terribly wrong we have falled out of the switch");
        }

        //Return players coordinates to update state.
        if (player == 1) {
            return this.player1Pos;
        } else if (player == 2) {
            return this.player2Pos;
        } else {
            return { x: -1, y: -1 };
        }
    }

    //Will take the direction the player wishes to shine light, the player number, and that players
    //obsucred board. Will return the updated board after walking the light to either another player,
    //the edge of the board, a rock, or the treasure.
    useLight(playerDirection: string, player: number, playerObscuredBoard: Array<Array<string>>) {
        //Starts light one square away from player to avoid collision on current location
        let x = 1;
        let playerLocation: Position = { x: -1, y: -1 };

        //Assign player locations so we know where they are.
        if (player == 1) {
            playerLocation = this.player1Pos;
        } else if (player == 2) {
            playerLocation = this.player2Pos;
        }

        switch (playerDirection) {
            case "N":
                //Mutate the player obscured board based on the data located in this.state as we walk the 2D array.
                //For example, if a rock is at the current square we are checking, we update
                //the player obscured board with that rock sprite. We do this for the rock,
                //treasure, opposite player sprite, and empty cells.
                while (true) {
                    if (playerLocation.x - x < 0) {
                        break;
                    }
                    else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = BoardStateValues.treasure;
                        break;
                    } else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.player1) {

                        break;
                    } else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = this.state[playerLocation.x - x][playerLocation.y]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            case "S":
                //Mutate the player obscured board based on the data located in this.state as we walk the 2D array.
                //For example, if a rock is at the current square we are checking, we update
                //the player obscured board with that rock sprite. We do this for the rock,
                //treasure, opposite player sprite, and empty cells.
                while (true) {
                    if (playerLocation.x + x > 9) {
                        break;
                    }
                    else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = BoardStateValues.treasure;
                        break;
                    } else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.player1) {

                        break;
                    } else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = this.state[playerLocation.x + x][playerLocation.y]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            case "E":
                //Mutate the player obscured board based on the data located in this.state as we walk the 2D array.
                //For example, if a rock is at the current square we are checking, we update
                //the player obscured board with that rock sprite. We do this for the rock,
                //treasure, opposite player sprite, and empty cells.
                while (true) {
                    if (playerLocation.y + x > 9) {
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = BoardStateValues.treasure;
                        break;
                    } else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.player1) {

                        break;
                    } else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = this.state[playerLocation.x][playerLocation.y + x]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            case "W":
                //Mutate the player obscured board based on the data located in this.state as we walk the 2D array.
                //For example, if a rock is at the current square we are checking, we update
                //the player obscured board with that rock sprite. We do this for the rock,
                //treasure, opposite player sprite, and empty cells.
                while (true) {
                    if (playerLocation.y - x < 0) {
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = BoardStateValues.treasure;
                        break;
                    } else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.player1) {
                        break;
                    } else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = this.state[playerLocation.x][playerLocation.y - x]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            default:
                console.log("Something terribly went wrong");
        }
        //Return the now updated board.
        return playerObscuredBoard;
    }
}

//Takes the positon the user wants to move to, the master board, the players obscured board, the player number and will return, and if the game is currently in a win condition
//the players board with them moved (or in the case the desired position is occupied, they will remain where they are.)
//This function gets imported into the app.ts file.
export function MakeMove(targetPosition: Position, currentBoard: Board, playerObscuredBoard: Array<Array<string>>, player: number, GameOn: any) {

    //Will empty current players location of their sprite
    if (player == 1) {
        playerObscuredBoard[currentBoard.player1Pos.x][currentBoard.player1Pos.y] = BoardStateValues.empty;
    } else if (player == 2) {
        playerObscuredBoard[currentBoard.player2Pos.x][currentBoard.player2Pos.y] = BoardStateValues.empty;
    }

    //Call the checkMove fucntion to see if move is valid. newPosition will be the coordinates returned from
    //the checkMove function above.
    let newPosition = currentBoard.checkMove(targetPosition, player, GameOn);

    //Update sprite for each player using new coordinates to show them move.
    if (player == 1) {
        playerObscuredBoard[currentBoard.player1Pos.x][currentBoard.player1Pos.y] = BoardStateValues.player1;
    } else if (player == 2) {
        playerObscuredBoard[currentBoard.player2Pos.x][currentBoard.player2Pos.y] = BoardStateValues.player2;
    }

    return playerObscuredBoard;
}

//Takes the direction the player wants to shine light, the master board, the players current obscured board, and the player number and will
//return the newly updated player obscured board.
//This function gets imported into the app.ts file.
export function playerUseLight(targetDirection: string, currentBoard: Board, playerObscuredBoard: Array<Array<string>>, player: number) {
    //Will set the obscured board to the newly less unobscured board that is revealed from the useLight function.
    playerObscuredBoard = currentBoard.useLight(targetDirection, player, playerObscuredBoard);

    return playerObscuredBoard;
}