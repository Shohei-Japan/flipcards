var socket = io();
function click(e){
    console.log(e);
    // console.log(e.srcElement.className);
    var src = {
        "className": e.srcElement.className,
        "backgroundImage": e.srcElement.style.backgroundImage,
        "index": e.srcElement.index,
        "id": e.srcElement.id,
        "number": e.srcElement.number
    };
    // console.log(src);
    var srcJSON = JSON.stringify(src);
    // console.log(srcJSON);
    socket.json.emit("client_to_server_click", srcJSON);
}

socket.on('server_to_client_clickedCard', function(clickedCard){
    console.log(clickedCard);
    let id = clickedCard.id;
    console.log(id);
    console.log('clickedCard受け取った！')
    let card = document.getElementById(id);
    card.style.backgroundImage = clickedCard.backgroundImage;
    console.log(card);
});

socket.on('server_to_client_flipedCard', function(flipedCard){
    // console.log(flipedCard);
    let id = flipedCard.id;
    // console.log(id);
    let card = document.getElementById(id);
    card.style.backgroundImage = flipedCard.backgroundImage;
    console.log(card);
});