let WebSocketSession;

window.onload = openWSClient();

function openWSClient() {
    //#region Create Connection and initalize
    WebSocketSession = new WebSocket('ws://localhost:3002')
    WebSocketSession.onopen = (event)=>{
        WebSocketSession.send("Hello World");
    }
    //#endregion
    //#region Message Decider
    WebSocketSession.onmessage = (Message)=>{
        let messageData = JSON.parse(Message.data);
        if (messageData.type == "Debug") {
            console.log(messageData.Data);
        } else if (messageData.type == "BoardState") {
            SetBoardData(messageData.Data);
        } else {
            console.log("unknown message type of ");
            console.log(Message)
        }
    }
    //#endregion
}

function getMove(element){
    console.log('Cell clicked');
    let clickedDiv = element;
    console.log("Clicked div is: ", clickedDiv);
    let clickedSpan = clickedDiv.getElementsByTagName("span");
    console.log("Span for clicked div is: ", clickedSpan);
    let spanId = clickedSpan.item(0).id;
    console.log("Span ID is: ", spanId);
    let spanType = clickedSpan.item(0).className;
    console.log("Span enum type is: ", spanType);
    //calculate 1D --> 2D
    var row = Math.floor(spanId / 10);
    var col = spanId % 10;
    console.log("2D array is: ", row, col);
    let coord = [row, col];
    console.log(coord);
    return coord;
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