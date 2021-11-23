let WebSocketSession;

function populateDivs(output){
    let divArray = document.getElementsByClassName("Position");
    for(let i = 0; i < divArray.length; i++){
        //document.getElementsByClassName("Board")[i] = array[i];
        document.getElementsByClassName("Position")[i].innerHTML = output[i];
    }
}

function openWSClient() {
    //#region Create Connection and initalize
    WebSocketSession = new WebSocket('ws://localhost:3002')
    WebSocketSession.onopen = (event)=>{
        WebSocketSession.send("Hello World");
    }
    //#endregion
    //#region Message Decider
    WebSocketSession.onmessage = (Message)=>{
        console.log(Message);
    }
    //#endregion
}

function getMove(element){
    console.log('Cell clicked');
    let clickedDiv = element.innerHTML;
    console.log(element);
    console.log(clickedDiv);
}

function SendMove() {

}

function GetBoardData() {
    
}