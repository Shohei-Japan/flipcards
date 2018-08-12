document.addEventListener('DOMContentLoaded', function() {
var socket = io(); // ソケットへの接続
var isEnter = false;
var name = '';

// サーバからのメッセージを受け取る
socket.on("server_to_client_message", function(data){appendMsg(data.value)});
function appendMsg(text) {
    // console.log('append');
    $("#chatLogs").append("<div>" + text + "</div>");
}

$("form").submit(function(e) {
    var message = $("#msgForm").val();
    var selectRoom = $("#rooms").val();
    // console.log("message form");
    $("#msgForm").val('');
    if (isEnter) {
        message = "[" + name + "]: " + message;
        // サーバにメッセージを送る
        socket.emit("client_to_server_message", {value : message});
    } else {
        name = message;
        var entryMessage = name + "さんが入室しました。";
        // 入室情報を送る
        // console.log(selectRoom);
        socket.emit("client_to_server_join", {value : selectRoom});
        // 他のプレイヤーに入室情報を送る
        socket.emit("client_to_server_broadcast", {value : entryMessage});
        // console.log(entryMessage);
        // C06. client_to_server_personalイベント・データを送信する
        socket.emit("client_to_server_personal", {value : name});
        // console.log(name);
        console.log('entryMessage');
        changeLabel();
    }
    e.preventDefault();
});

function changeLabel() {
    $(".nameLabel").text("メッセージ：");
    $("#rooms").prop("disabled", true);
    $("button").text("送信");
    isEnter = true;
}
});