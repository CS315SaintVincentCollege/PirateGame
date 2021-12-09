# Pirate Game
### Class: CS-315 Server Side Programming 
### Authors: Nate Fabian & Joseph Choby 
### Purpose of the Program: 2-player treasure hunt game built using Javascript and node.js. 
### URL to interact with server: cis.stvincent.edu:3001

This project will serve a gameboard that two players can connect to and interact with in real time. All game logic and board states are handled by node.js processes listening on the port the game is served at.

### Project Information: 
The game project is located within the CIS Linux server at /www/Team2021B and listens on port 3001.
We utilized TypeScript for the creation of this project to ensure our type safety and to get several tools that make JavaScript much more reliable. When you run `npm run Serv`, the TypeScript files get compiled into Javascript files that get sent out by node.js. For more information on TypeScript: https://www.typescriptlang.org/. **<u>Note: do not look into the JavaScript files for any notes or comments as we will comment on the easier to read TypeScript files.<u>**

### To run the web server: 
Ensure that you are in the correct folder with our game and run: `npm run Serv`. If that fails, you will need to install our node packages and libraries. Use: `npm install` (or npm i). With the server running, use a browser and type in: http://cis.stvincent.edu:3001 You will be defaultly placed at the gameboard and will be logged in as player 1. To get a second connection, open another tab and type http://cis.stvincent.edu:3001 again and you will be player two. You can then interact with the board on both tabs and compete to find the treasure! Once a player wins the game, simply have each player refresh their browser to restart!

### Notes on game setup, logic, and functions: 
We have divided the project into two seperate folders: one for the client side and one for the server side.

#### Client Side Files
The **index.html** page simply displays an interactable board to users.
**GameHandler.js** creates our client connections and also handles our message system. Any action on the page will send a message to this file which will send a message to our server to process.
We also have a **style.css** file that handles formatting on our web page and other **.png** files that correspond to our sprites that we used for this project.

#### Server Side Files
**I will only be talking about the .ts files as these get compiled into the corresponding .js files. It would be repetative to go through these twice. <u>Do not look into the JavaScript files for any notes or comments as we will comment on the easier to read TypeScript files.<u>**
The **app.ts** file is the state manager for the game. Here, we establish ports, establish sessions for each player, create the main board, and the obscured boards for each player that will display. This file will call on **game.ts** to return the states of the boards to send back to the client.
The **game.ts** file is the game logic handler. Here, the server will get a message from the **GameHandler.js** file and **app.js**. Here, we have functions to set up the master board, to obscure a board, check a players move, and allow users to use a light to uncover the squares in the direction they choose. The last couple export functions in this file send their results of the board state back to the **app.ts** file to head back to the client.
