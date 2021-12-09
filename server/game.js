"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerUseLight = exports.MakeMove = exports.Board = void 0;
var BoardStateValues;
(function (BoardStateValues) {
    BoardStateValues["empty"] = "E";
    BoardStateValues["treasure"] = "T";
    BoardStateValues["player1"] = "1";
    BoardStateValues["player2"] = "2";
    BoardStateValues["rock"] = "R";
    BoardStateValues["unknown"] = "U";
})(BoardStateValues || (BoardStateValues = {}));
var Board = /** @class */ (function () {
    function Board() {
        this.boardSize = 10;
        this.state = new Array(10);
        for (var i = 0; i < this.boardSize; i++) {
            this.state[i] = new Array(10);
        }
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                if (Math.random() > 0.8) {
                    this.state[i][j] = BoardStateValues.rock;
                }
                else {
                    this.state[i][j] = BoardStateValues.empty;
                }
            }
        }
        this.state[Math.floor(Math.random() * 8) + 1][Math.floor(Math.random() * 8) + 1] = BoardStateValues.treasure;
        this.state[0][this.boardSize - 1] = BoardStateValues.player1;
        this.state[this.boardSize - 1][0] = BoardStateValues.player2;
        this.player1Pos = { x: 0, y: 9 };
        this.player2Pos = { x: 9, y: 0 };
    }
    Board.prototype.obscureBoard = function (player) {
        var newBoard = JSON.parse(JSON.stringify(this.state));
        if (player == 1) {
            for (var i = 0; i < this.boardSize; i++) {
                for (var j = 0; j < this.boardSize; j++) {
                    if (newBoard[i][j] != BoardStateValues.player1) {
                        newBoard[i][j] = BoardStateValues.unknown;
                    }
                    else {
                        newBoard[i][j] = BoardStateValues.player1;
                    }
                }
            }
            return newBoard;
        }
        else if (player == 2) {
            for (var i = 0; i < this.boardSize; i++) {
                for (var j = 0; j < this.boardSize; j++) {
                    if (newBoard[i][j] != BoardStateValues.player2) {
                        newBoard[i][j] = BoardStateValues.unknown;
                    }
                }
            }
            return newBoard;
        }
    };
    Board.prototype.printBoard = function () {
        this.state.forEach(function (row) {
            var output = "";
            row.map(function (item) {
                output = output.concat(item);
            });
            console.log(output);
        });
    };
    Board.prototype.SerializeBoard = function () {
        return this.state;
    };
    Board.prototype.checkMove = function (coords, player, GameOn) {
        var returnPosition = undefined;
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
                GameOn.foo = false;
                //end game
                break;
            //case BoardStateValues.unknown:
            case BoardStateValues.empty:
                console.log("Square is free. Move to square");
                //move player sprite
                if (player == 1) {
                    this.state[this.player1Pos.x][this.player1Pos.y] = BoardStateValues.empty;
                    this.player1Pos.x = coords.x;
                    this.player1Pos.y = coords.y;
                    this.state[coords.x][coords.y] = BoardStateValues.player1;
                    console.log(this.state);
                }
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
        if (player == 1) {
            return this.player1Pos;
        }
        else if (player == 2) {
            return this.player2Pos;
        }
        else {
            return { x: -1, y: -1 }; //we should never hit here if we do panic your missing your player
        }
    };
    Board.prototype.useLight = function (playerDirection, player, playerObscuredBoard) {
        //Starts light one square away from player to avoid collision on current location
        var x = 1;
        var playerLocation = { x: -1, y: -1 };
        if (player == 1) {
            playerLocation = this.player1Pos;
        }
        else if (player == 2) {
            playerLocation = this.player2Pos;
        }
        switch (playerDirection) {
            case "N":
                //case for board edge
                while (true) {
                    //mutate the player obscured board based on the information located in this.state
                    if (playerLocation.x - x < 0) {
                        console.log("At edge of board. Cannot go North to uncover anything!");
                        break;
                    }
                    else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = BoardStateValues.treasure;
                        break;
                    }
                    else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.player1) {
                        break;
                    }
                    else if (this.state[playerLocation.x - x][playerLocation.y] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x - x][playerLocation.y] = this.state[playerLocation.x - x][playerLocation.y]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            case "S":
                while (true) {
                    //case for board edge
                    if (playerLocation.x + x > 9) {
                        console.log("At edge of board. Cannot go North to uncover anything!");
                        break;
                    }
                    else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = BoardStateValues.treasure;
                        break;
                    }
                    else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.player1) {
                        break;
                    }
                    else if (this.state[playerLocation.x + x][playerLocation.y] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x + x][playerLocation.y] = this.state[playerLocation.x + x][playerLocation.y]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            case "E":
                while (true) {
                    if (playerLocation.y + x > 9) {
                        console.log("At edge of board. Cannot go North to uncover anything!");
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.rock) {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.treasure) {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = BoardStateValues.treasure;
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.player1) {
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y + x] == BoardStateValues.player2) {
                        break;
                    }
                    else {
                        playerObscuredBoard[playerLocation.x][playerLocation.y + x] = this.state[playerLocation.x][playerLocation.y + x]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            case "W":
                while (true) {
                    if (playerLocation.y - x < 0) {
                        console.log("At edge of board. Cannot go North to uncover anything!");
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.rock) {
                        console.log("we hit a rock at ".concat(x));
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = BoardStateValues.rock;
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.treasure) {
                        console.log("we hit a treasure at ".concat(x));
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = BoardStateValues.treasure;
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.player1) {
                        console.log("we hit a player 1 at ".concat(x));
                        break;
                    }
                    else if (this.state[playerLocation.x][playerLocation.y - x] == BoardStateValues.player2) {
                        console.log("we hit a player 2 at ".concat(x));
                        break;
                    }
                    else {
                        console.log("uncovering ".concat(playerLocation.x, " ").concat(playerLocation.y - x));
                        playerObscuredBoard[playerLocation.x][playerLocation.y - x] = this.state[playerLocation.x][playerLocation.y - x]; //this is the "uncovering"
                        x++;
                    }
                }
                break;
            default:
                console.log("Something terribly went wrong");
        }
        console.log(this.state);
        return playerObscuredBoard; //return the now updated board;
    };
    return Board;
}());
exports.Board = Board;
function MakeMove(targetPosition, currentBoard, playerObscuredBoard, player, GameOn) {
    if (player == 1) {
        playerObscuredBoard[currentBoard.player1Pos.x][currentBoard.player1Pos.y] = BoardStateValues.empty;
    }
    else if (player == 2) {
        playerObscuredBoard[currentBoard.player2Pos.x][currentBoard.player2Pos.y] = BoardStateValues.empty;
    }
    var newPosition = currentBoard.checkMove(targetPosition, player, GameOn);
    console.log("you are ".concat(player, " moving to ").concat(targetPosition));
    if (player == 1) {
        playerObscuredBoard[currentBoard.player1Pos.x][currentBoard.player1Pos.y] = BoardStateValues.player1;
    }
    else if (player == 2) {
        playerObscuredBoard[currentBoard.player2Pos.x][currentBoard.player2Pos.y] = BoardStateValues.player2;
    }
    return playerObscuredBoard;
}
exports.MakeMove = MakeMove;
function playerUseLight(targetDirection, currentBoard, playerObscuredBoard, player) {
    playerObscuredBoard = currentBoard.useLight(targetDirection, player, playerObscuredBoard);
    return playerObscuredBoard;
}
exports.playerUseLight = playerUseLight;
