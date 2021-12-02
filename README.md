# PirateGame
CS315 TeamB2021 Node.js pirate game
Make all changes in game.ts in server folder
```
--Make all board changes game.ts in server folder
//Function Psuedocode and ideas.

//Not sure if we need this one.
//Take board and fog it out for each player?
fogBoard??
// Do this Server Side

//When a player clicks on a div, check it then move them
//Return a board with the players moved
playerMove(divSquare){
//Take the div the player clicked on
Check the square in case either an obstacle or player is there.
If obstacle or player is on clicked square, check to left right up and down
and put player on the first free square
If square is the treasure
IF square is invalid
}

//I don't think we need a rotate player
rotatePlayer(controlClick){
switch or if statements that rotate character sprite based
on which square they click
}

//If player uses the light button
//Return board with uncovered squares
lightUse(){
figure out which way player is facing
walk that direction and show squares until obstacle or board edge is hit
}
```
I think we would benefit from some sort of player class:
export class Player {
    constructor(postiion, direction, sprite){
        this.position = position;
        this.direction = direction;
        this.sprite = sprite;
    }
}
Define player 1 and 2:
let player1 = new Player(coord[0][9], "S", "BoardItem Sprite1");
let player2 = new Player(coord[9][0], "N", "BoardItem Sprite2");