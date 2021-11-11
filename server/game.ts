type Position = {
    x: number,
    y: number
}

class Board {
    state: Array<Array<string>>;
    boardSize = 10;

    constructor() {
        this.state = new Array(10);
        for (let i = 0; i < this.boardSize; i++) {
            this.state[i] = new Array(10);
        }

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.state[i][j] = "H";
            }
        }
    }


    printBoard() {
        this.state.forEach((row) => {
            let output = "";

            row.map((item)=>{
                output = output.concat(item);
            });
            console.log(output);
        });
    }
}

let board = new Board();

board.printBoard();