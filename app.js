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

const marks = ['s', 'c', 'h', 'd']; // スペード、クローバー、ハート、ダイヤ
var allCards = []; // rooms = [[cards],[cards],[cards]];
var flipedCard;

// connectionイベント・データを受信する
io.sockets.on('connection', function(socket) {
    var room = '';
    var name = '';

    // roomへの入室は、「socket.join(room名)」
    socket.on('client_to_server_join', function(data) {
        room = data.value;
        socket.join(room);
        // console.log(io.sockets.adapter.sids[socket.id]); // 
    });

    // メッセージ
    socket.on('client_to_server_message', function(data) {
        console.log(room);
        io.to(room).emit('server_to_client_message', {value : data.value});
    });

    // 入室情報
    socket.on('client_to_server_broadcast', function(data) {
        socket.broadcast.to(room).emit('server_to_client_message', {value : data.value});
    });

    // 自分のみに送信
    socket.on('client_to_server_personalJoin', function(data) {
        var id = socket.id;
        console.log('idは・・・');
        console.log(id);
        name = data.value;
        console.log(name);
        var joinMessage = "あなたは、" + name + "さんとして" + room + "に入室しました。";
        io.to(id).emit('server_to_client_joinMessage', {value : joinMessage});
    });

    
        
        if(flipedCard.number == num){ // ２枚のカードの数字が同じ場合
            console.log('4');
            clickedCard.backgroundImage = "url(" + clickedCard.index + ")";
            io.to(room).emit('server_to_client_clickedCard', clickedCard); // 変更したあとの情報をおくる
            // socket.emit('server_to_client_sameCard', flipedCard); // 変更したあとの情報をおくる
            flipedCard = null;
        } else { // カードの数字が違う場合
            // console.log('5');
            // console.log(clickedCard.index);
            clickedCard.backgroundImage = "url(" + clickedCard.index + ")";
            // console.log('6');
            // console.log(clickedCard.backgroundImage);
            // console.log('7');
            io.to(room).emit('server_to_client_clickedCard',clickedCard); // 変更したあとの情報をおくる
            setTimeout(function () {
                console.log('8');
                clickedCard.backgroundImage = "url(png/z01.png)";
                console.log(clickedCard.backgroundImage);
                console.log('9');
                flipedCard.backgroundImage = "url(png/z01.png)";
                console.log(flipedCard.backgroundImage);
                io.to(room).emit('server_to_client_clickedCard',clickedCard); // 変更したあとの情報をおくる
                io.to(room).emit('server_to_client_flipedCard',flipedCard); // 変更したあとの情報をおくる
                flipedCard = null;
            }, 1000);
        }
    });
});

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