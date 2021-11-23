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

        this.state[Math.floor(Math.random()*10)][Math.floor(Math.random()*10)] = BoardStateValues.treasure;

        this.state[0][this.boardSize - 1] = BoardStateValues.player1;
        this.state[this.boardSize -1][0] = BoardStateValues.player2;
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

    SerializeBoard() {
        return this.state;
    }
}