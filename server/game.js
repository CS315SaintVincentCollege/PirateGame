"use strict";
var Board = /** @class */ (function () {
    function Board() {
        this.boardSize = 10;
        this.state = new Array(10);
        for (var i = 0; i < this.boardSize; i++) {
            this.state[i] = new Array(10);
        }
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                this.state[i][j] = "H";
            }
        }
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
    return Board;
}());
var board = new Board();
board.printBoard();
