# PirateGame
Class: CS-315 Server Side Programming 
Authors: Nate Fabian & Joseph Choby 
Purpose of the Program: 2-player treasure hunt game built using Javascript and node.js. 
URL to interact with server: cis.stvincent.edu:3001

This project will serve a gameboard that two players can connect to and interact with in real time. All game logic and board states are handled by node.js processes listening on the port the game is served at.


Project Information: The game project is located within the CIS Linux server at /www/Team2021B and listens on port 3001. 


To run the web server: Ensure that you are in the correct folder with our game and run: npm run Serv. If that fails, you will need to install our node packages and libraries. Use: npm install (or npm i). With the server running, use a browser and type in: http://cis.stvincent.edu:3001 You will be defaultly placed at the gameboard and will be logged in as player 1. To get a second connection, open another tab and hype http://cis.stvincent.edu:3001 again and you will be player two. You can then interact with the board on both tabs and compete to find the treasure!

Notes on game logic and functions:

