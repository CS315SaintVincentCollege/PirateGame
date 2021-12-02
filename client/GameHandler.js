let WebSocketSession;
let playerID;

window.onload = openWSClient();

function openWSClient() {
    //#region Create Connection and initalize
    WebSocketSession = new WebSocket('ws://10.94.13.95:3002')
    WebSocketSession.onopen = (event)=>{
        WebSocketSession.send(JSON.stringify({messageType: "DEBUG", data: "Hello World"}));
    }
    //#endregion
    //#region Message Decider
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
            default: {
                console.log(`unknown message type of ${messageData.type}`);
                console.log(Message)
            }
        }
    }
    //#endregion
}

function getMove(element){
    let clickedDiv = element;
    let clickedSpan = clickedDiv.getElementsByTagName("span");
    let spanId = clickedSpan.item(0).id;
    let spanType = clickedSpan.item(0).className;
    //calculate 1D --> 2D
    var row = Math.floor(spanId / 10);
    var col = spanId % 10;
    let coord = [row, col];
    console.log(`player is ${playerID}`);
    let messageObject = {messageType: "move", PlayerID: playerID, position: {x: row, y: col}};
    WebSocketSession.send(JSON.stringify(messageObject)); //REFACTOR ME AFTER MERGE
    console.log(messageObject);
}

function SendMove() {
    
}

function SetBoardData(BoardData) {
    
    let Board1D = [];
    for (let i = 0; i < BoardData.length; i++) {
        Board1D = Board1D.concat(BoardData[i])
    }
    
    populateDivs(Board1D);
}

function populateDivs(output){
    let divArray = document.getElementsByClassName("Position");
    for(let i = 0; i < divArray.length; i++){
        //document.getElementsByClassName("Board")[i] = array[i];
        document.getElementsByClassName("Position")[i].innerHTML = `<span id="${i}" class="BoardItem Sprite${output[i]}"></span>`;
    }
}