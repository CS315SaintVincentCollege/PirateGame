console.clear();
//clear the console

//#region Globals and imports
var fs = require('fs'),
    http = require('http');
import { WebSocketServer } from 'ws';
import { IncomingMessage, ServerResponse } from 'http';

import {Board, MakeMove, playerUseLight} from './game';
//import functions and objects for game from game.ts

let WebSocketPort = 3002;
let WebServerPort = 3001;
//define the server and websocket ports
//#endregion

//#region Web Socket Setttings
const wss = new WebSocketServer({ port: WebSocketPort });
//create the web socket server

//#region Game Globals
let playerCount = 0;
let GameOn = {foo: true};
let game = new Board(); //master board should not be sent to client
//#endregion

wss.on('connection', function connection(ws) {
  let playerID: Number = -1;
 
  let p1Board = game.obscureBoard(1);
  let p2Board = game.obscureBoard(2);

  //When each player connects send them their obscured board and let them know what player they are
  if (playerCount == 0) {
    // send to just player 1
    console.log("player 1 connected");
    playerID = 1;
    playerCount++;
    ws.send(JSON.stringify({type: "BoardState", Data: p1Board}));
  } else if (playerCount == 1) {
    // send to just player 2
    console.log("player 2 connected");
    playerID = 2;
    playerCount++;
    ws.send(JSON.stringify({type: "BoardState", Data: p2Board}));
    wss.clients.forEach((client)=> {
      client.send(JSON.stringify({type: "Notify", Data: "Game can Begin"}))
    });
    GameOn.foo = true;
  }

  ws.send(JSON.stringify({type: "PlayerAssignment", Data: playerID}));

  //when a message is receaved from a given connection
  ws.on('message', function message(data) {
    //parse message data 
    let parsedMessageData = JSON.parse(data.toString());

    //switch on the type of message receaved
    switch (parsedMessageData.messageType) {
      //process move for a given player
      case "move":
        if (playerID == 1) {
          //Message is from player 1 Make their move and return their obscured board
          p1Board = MakeMove(parsedMessageData.position, game, p1Board, 1, GameOn);
          ws.send(JSON.stringify({type: "BoardState", Data: p1Board}));
          //check if their move was a winning move if so end the game and notify the players
          if (GameOn.foo == false) {
            wss.clients.forEach((client)=> {
              client.send(JSON.stringify({type: "Notify", Data: "Player 1 has won"}));
              client.send(JSON.stringify({type: "BoardState", Data: game.state}));
            });
            resetGlobals();
          }
        } else if (playerID == 2) {
          //Message is from player 2 Make their move and return their obscured board
          p2Board = MakeMove(parsedMessageData.position, game, p2Board, 2, GameOn);
          ws.send(JSON.stringify({type: "BoardState", Data: p2Board}));
          //check if their move was a winning move if so end the game and notify the players
          if (GameOn.foo == false) {
            wss.clients.forEach((client)=> {
              client.send(JSON.stringify({type: "Notify", Data: "Player 2 has won"}));
              client.send(JSON.stringify({type: "BoardState", Data: game.state}));
            });
            resetGlobals();
          }
        } else {
          // is unknown player
        }
      break;
      case "light":
        //process the light message for a specific player and return their board
        if (playerID == 1) {
          //Message if from player 1
          p1Board = playerUseLight(parsedMessageData.Direction, game, p1Board, 1);
          ws.send(JSON.stringify({type: "BoardState", Data: p1Board}));
        } else if (playerID == 2) {
          //Message if from player 2
          p2Board = playerUseLight(parsedMessageData.Direction, game, p2Board, 2);
          ws.send(JSON.stringify({type: "BoardState", Data: p2Board}));
        } else {
          // is unknown player
        }
    }
  });
});

//reset globals back at the end of the game and close any existing client connections
function resetGlobals() {
  wss.clients.forEach((client)=>{
    client.close();
    playerCount = 0;
    GameOn.foo = true;
    game = new Board(); //master board should not be sent to client
    console.log("GAME END");
  })
//#endregion


//#region Express Server Settup
http.createServer(function (req: IncomingMessage, res: ServerResponse) {
  //default case for direct connection
  if (req.url == '/') {
    fs.readFile(__dirname + '/../client/' + 'index.html', function (err: any, data:any) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    })
  } else {
    //server files within the client directory in all other cases
    fs.readFile(__dirname + '/../client/' + req.url, function (err: any, data:any) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}).listen(WebServerPort);
console.log(`WebServer @ http://localhost:${WebServerPort} and sockets are on port ${WebSocketPort}`);
//#endregion


}