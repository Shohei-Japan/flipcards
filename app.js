// 必要なモジュールを読み込む
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

// HTTPサーバを生成する
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/flipcard.html', 'utf-8'));
}).listen(3000);  // ポート競合の場合は値を変更

//  HTTPサーバにソケットを紐付ける（WebSocket有効化）
var io = socketio.listen(server);
 
const cards = [];
const marks = ['s', 'c', 'h', 'd']; // スペード、クローバー、ハート、ダイヤ
var flipedCard;
var td;

// connectionイベント・データを受信する
io.sockets.on('connection', function(socket) {
    // client_to_serverイベント・データを受信する
    socket.on('client_to_server_onload', function() {
        for(let i = 0; i < marks.length; i++){
            for(let j = 1; j < 14; j++){ // s01 〜 d13まで生成
                var card = {
                    mark: marks[i] + ("0" + j).slice(-2),
                    number: j,
                    open: false
                }
                cards.push(card); // 連想配列
            }
        }
        // console.log(cards);
        shuffle();
    });
    // console.log(cards);
    // server_to_clientイベント・データを送信する
    io.sockets.emit('server_to_client_draw', {value : cards});
});


// 生成したカードをシャッフル
function shuffle(){
    for(var i = cards.length - 1; i > 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = cards[i];
        cards[i] = cards[r];
        cards[r] = tmp;
    }
    // console.log(cards);
}


function click(e){
    let firstCard = e.srcElement;
    console.log(firstCard);
    let num = firstCard.number
    firstCard.className = 'card open';
    
    if(flipedCard == null){
        flipedCard = firstCard;
        firstCard.style.backgroundImage = "url(" + firstCard.index + ")";
        return;
    }
    // console.log(flipedCard.id, e.srcElement.id);
    // 同じカードを２回クリックしても反応しない
    if(flipedCard.id == e.srcElement.id){
        return;
    }
    if(flipedCard.number == num){ // ２枚のカードの数字が同じ場合
        // console.log(e.srcElement);
        e.srcElement.style.backgroundImage = "url(" + e.srcElement.index + ")";
        flipedCard = null;
    } else {
        e.srcElement.style.backgroundImage = "url(" + e.srcElement.index + ")";
        setTimeout(function () {
            firstCard.style.backgroundImage = "url(trump/png/z01.png)";
            flipedCard.style.backgroundImage = "url(trump/png/z01.png)";
            flipedCard = null;
        }, 1000);
    }
}