"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
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
    }
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
    return Board;
}());
exports.Board = Board;
