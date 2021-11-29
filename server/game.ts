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
        this.state[this.boardSize - 1][0] = BoardStateValues.player2;
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

    checkMove(coords: any){

        switch(this.state[coords[0]][coords[1]]) {
            case BoardStateValues.player1:
            case BoardStateValues.player2:
            case BoardStateValues.rock:
              console.log("Square is occupied");
              //check squares to move player?
              //check square to the N
              if(this.state[coords[0] - 1][coords[1]] == BoardStateValues.empty){
                  //unfog and move
              }
              //Check square to the S
              else if(this.state[coords[0] + 1][coords[1]] == BoardStateValues.empty)
              {
                //unfog and move
              }
              //Check square to the W
              else if(this.state[coords[0]][coords[1] - 1] == BoardStateValues.empty)
              {
                //unfog and move
              }
              //check square to the E
              else if(this.state[coords[0]][coords[1] + 1] == BoardStateValues.empty)
              {
                //unfog and move
              }
              else
              {
                //Player cannot make that move
                console.log("All locations blocked. Move impossible");
              }
              break;
            case BoardStateValues.treasure:
              console.log("Treasure found");
              //end game
              break;
            case BoardStateValues.unknown:
                console.log("Something is wrong with this square generation");
                break;
            case BoardStateValues.empty:
                console.log("Square is free");
                //move player sprite
            default:
                console.log("Something is terribly wrong");
          }

    }
}