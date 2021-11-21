# PirateGame
CS315 TeamB2021 Node.js pirate game

```
//Function Psuedocode and ideas.

//Takes an array of numbers from 1 to x and puts them in each div.
//Returns a board with each div numbered.
populateDivs(array) -->have this already

//Take in a board with all divs labeled already
//Will walk each div and generate a random number between say 0 and 3.
//Each number will correspond to an asset that will populate there.
initializeBoard(board){
for(let i = 0; i < divArray.length; i++){
        /*I think maybe spwaning each player in set locations
        Player 1 is in the top left and player 2 is in bottom left*/
        generate random number
        
        if or switch for each number and the asset generation for each
    }
}

//Not sure if we need this one.
//Take board and fog it out for each player?
fogBoard??

//When a player clicks on a div, check it then move them
//I am not sure about how this one will work for sure...
//If it is possible to get the div square we can pass that in I think
//Return a board with the players moved
playerMove(divSquare){
//Take the div the player clicked on
Check the square in case either an obstacle or player is there.
If obstacle or player is on clicked square, check to left right up and down
and put player on the first free square
If square is the treasure???
IF square is invalid?
}

//If we go with the controller on the side with a N,S,E,W and center being the 
//light, if we can take in an onClick for each individual thing, we take that
//Return player rotated.
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
