let WebSocketSession;
let playerID;

window.onload = openWSClient();
//on windows load open WS client to server

let gameActive = false;

let messageTimer;

function openWSClient() {
    //#region Create Connection and initalize
    WebSocketSession = new WebSocket('ws://cis.stvincent.edu:3002')
    WebSocketSession.onopen = (event)=>{
        WebSocketSession.send(JSON.stringify({messageType: "DEBUG", data: "Hello World"}));
    }
    //#endregion
    //#region Message Decider
    //Message type from the server decides what to do with the incomming message on the websocket
    WebSocketSession.onmessage = (Message)=>{
        let messageData = JSON.parse(Message.data);

        console.log(messageData.Data);

        switch (messageData.type) {
            case "Debug": {
                console.log(messageData.Data);
                break;
            }
            case "PlayerAssignment": {
                playerID = messageData.Data;
                console.log(`you are player ${playerID}`);
                break;
            }
            case "BoardState": {
                SetBoardData(messageData.Data);
                break;
            }
            case "Notify": {
                Notify(messageData.Data);
            }
            default: {
                console.log(`unknown message type of ${messageData.type}`);
                console.log(Message)
            }
        }
    }
    //#endregion
}

//Clicked from html in browser sends a websocket message back to the server to process move
function getMove(element){
    if (gameActive) {
        let clickedDiv = element;
        let clickedSpan = clickedDiv.getElementsByTagName("span");
        let spanId = clickedSpan.item(0).id;
        //calculate 1D --> 2D
        let row = Math.floor(spanId / 10);
        let col = spanId % 10;
        let coord = {x: row, y: col};
        let messageObject = {messageType: "move", PlayerID: playerID, position: coord};
        WebSocketSession.send(JSON.stringify(messageObject));
    } else {
        //if the game hasent started dont let the player move
        Notify("Game not active wait for other player");
    }
}

//Clicked from html in browser sends a websocket message back to the server to process light shine
function getLight(direction) {
    if (gameActive) {
        let messageObject = {messageType: "light", PlayerID: playerID, Direction: direction};
        WebSocketSession.send(JSON.stringify(messageObject));
    } else {
        //if the game hasent started dont let the player shine a light
        Notify("No peaking");
    }
}

//when the server sends the boards state as a 2D array convert it to a 1D array and call populate divs
function SetBoardData(BoardData) {
    
    let Board1D = [];
    for (let i = 0; i < BoardData.length; i++) {
        Board1D = Board1D.concat(BoardData[i])
    }
    
    populateDivs(Board1D);
}

//take the 1D array of values from the server and display them in the HTML grid
function populateDivs(output){
    let divArray = document.getElementsByClassName("Position");
    for(let i = 0; i < divArray.length; i++){
        //document.getElementsByClassName("Board")[i] = array[i];
        document.getElementsByClassName("Position")[i].innerHTML = `<span id="${i}" class="BoardItem Sprite${output[i]}"></span>`;
    }
}

//When a notify command is processed show it at the bottom of the screen for 10 seconds or until another message comes in
function Notify(Message) {
    clearTimeout(messageTimer); //clear previous hider of message
    if (Message == "Game can Begin") {
        EnableMoves();
    }

    let Popup = document.getElementById("Notify");
    Popup.classList = "ShowNotif"
    Popup.innerHTML = Message;
    
    messageTimer = setTimeout(()=>{
        document.getElementById("Notify").classList = "";
        //hide message after 10 seconds
    }, 10000);
}

//message from server to begin game has started allow browser click functions to send moves to server
function EnableMoves() {
    gameActive = true;
}
