// 必要なモジュールを読み込む
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

function getType(_url) {
    var types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".gif": "image/gif",
        ".svg": "svg+xml"
    }
    for (var key in types) {
        if (_url.endsWith(key)) {
            return types[key];
        }
    }
    return "text/plain";
}

var server = http.createServer(function (req, res){
    var url = "public" + req.url;
    // console.log(url);
    if (fs.existsSync(url)){
        fs.readFile(url, (err, data) =>{
            if (!err){
                res.writeHead(200, {"Content-Type": getType(url)});
                res.end(data);
            }
        });
    }
}).listen(3000);
console.log("サーバーに繋がりましたよ！");

//  HTTPサーバにソケットを紐付ける（WebSocket有効化）
var io = socketio.listen(server);



// 生成したカードをシャッフル
function shuffle(cards){
    // console.log("shuffleです。cards受け取りました。");
    // console.log(cards.length);
    // console.log("shuffleするよ");
    // console.log(cards);
    for(var i = cards.length - 1; i >= 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = cards[i];
        cards[i] = cards[r];
        cards[r] = tmp;
    }
    // console.log(cards);
    // console.log("cards情報送るよ");
    io.sockets.emit('server_to_client_draw', {value : cards});
    // console.log("cards情報送った！");
}