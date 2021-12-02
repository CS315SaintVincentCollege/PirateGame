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
        this.state[Math.floor(Math.random() * 10)][Math.floor(Math.random() * 10)] = BoardStateValues.treasure;
        this.state[0][this.boardSize - 1] = BoardStateValues.player1;
        this.state[this.boardSize - 1][0] = BoardStateValues.player2;
        this.player1Pos = { x: 0, y: 9 };
        this.player2Pos = { x: 9, y: 0 };
    }
    Board.prototype.obscureBoard = function (player) {
        var newBoard = this.state;
        if (player == 1) {
            for (var i = 0; i < this.boardSize; i++) {
                for (var j = 0; j < this.boardSize; j++) {
                    if (newBoard[i][j] != BoardStateValues.player1) {
                        newBoard[i][j] = BoardStateValues.unknown;
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
    Board.prototype.checkMove = function (coords, player) {
        var returnPosition = undefined;
        switch (this.state[coords.x][coords.y]) {
            case BoardStateValues.player1:
            case BoardStateValues.player2:
            case BoardStateValues.rock:
                console.log("Square is occupied");
                //check squares to move player?
                //send space ocupied message
                break;
            case BoardStateValues.treasure:
                console.log("Treasure found");
                //end game
                break;
            case BoardStateValues.unknown:
                console.log("Move to new square and make known");
                break;
            case BoardStateValues.empty:
                console.log("Square is free move to square");
            //move player sprite
            default:
                console.log("Something is terribly wrong we have falled out of the switch");
        }
        //make sure you update the player position
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
    return Board;
}());
exports.Board = Board;
function MakeMove(targetPosition, currentBoard, playerObscuredBoard, player) {
    var newPosition = currentBoard.checkMove(targetPosition, player);
    if (player == 1) {
        playerObscuredBoard[newPosition.x][newPosition.y] = BoardStateValues.player1;
    }
    else if (player == 2) {
        playerObscuredBoard[newPosition.x][newPosition.y] = BoardStateValues.player2;
    }
    return playerObscuredBoard;
}
exports.MakeMove = MakeMove;
function playerUseLight(targetDirection, currentBoard, playerObscuredBoard, player) {
    //playerObscuredBoard = currentBoard.useLight(targetDirection, player);
    return playerObscuredBoard;
}
exports.playerUseLight = playerUseLight;
