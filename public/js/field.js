document.addEventListener('DOMContentLoaded', function() {
var socket = io();

var td;
var field = document.getElementById("field");
console.log(field);
    
$(field).ready(function(e){
    console.log("ready");
    socket.emit("client_to_server_onload", {value: field});
});

socket.on("server_to_client_draw", function(data){
    console.log("サーバーからdrawへ");
    console.log(data.value);
    draw(data.value);
});

// DOMに書き出す
function draw(cards){
    console.log("drawまできました");
    // console.log(cards);
    var field = document.getElementById("field");
    field.innerHTML = "";
    for (var i = 0; i < 4; i++){
        var tr = document.createElement("tr");
        for (var j = 0; j < 13; j++){
            td = document.createElement("td");
            var index = i * 13 + j;
            // console.log(cards[index]);
            var id = cards[index].mark; // シャッフルした配列から指定する
            td.className = "card back";
            td.id = id;
            var src = 'png/'+id+'.png';
            // console.log(src);
            td.index = src;
            td.style.backgroundImage = "url( png/z01.png )";
            // td.textContent = id;
            td.number = cards[index].number;
            td.onclick = click;
            tr.appendChild(td);
        }
        field.appendChild(tr);
    }
    console.log(field);
}
});