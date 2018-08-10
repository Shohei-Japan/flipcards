// 必要なモジュールを読み込む
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
var flipedCard;


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
    console.log(url);
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

var cards = [];
const marks = ['s', 'c', 'h', 'd']; // スペード、クローバー、ハート、ダイヤ
var flipedCard;

// connectionイベント・データを受信する
io.sockets.on('connection', function(socket) {
    // console.log("connectionした");
    // client_to_serverイベント・データを受信する
    socket.on('client_to_server_onload', function() {
        // console.log("readyした");
        cards = [];
        for(let i = 0; i < marks.length; i++){
            for(let j = 1; j < 14; j++){ // s01 〜 d13まで生成
                var card = {
                    mark: marks[i] + ("0" + j).slice(-2),
                    number: j,
                    open: false
                }
                cards.push(card); // 連想配列
                // console.log("cardsにpushしたよ"+i+"回目");
            }
            // console.log("cardsに全部pushしたよ"+i+"回目");
        }
        // console.log("shuffleに送るよ")
        shuffle(cards);
    });
    // server_to_clientイベント・データを送信する

    // clickを受け取る
    socket.on('client_to_server_click', function(srcJSON){
        console.log("click情報受け取った");
        var firstCard = JSON.parse(srcJSON);
        // var src = JSON.parse(srcJSON);
        // console.log('srcは'+src);
        // console.log("srcParse.indexは" + srcParse.index);
        var num = firstCard.number; // 1枚目にかかれている数字
        // console.log('numは'+num);
        // console.log("indexは" + firstCard.index);
        firstCard.className = 'card'; // 1枚目のクラスからbackを取る

        console.log('1');
        console.log(flipedCard);
        if(flipedCard == null){
            console.log('2');
            flipedCard = firstCard;
            console.log('3');
            console.log(flipedCard);
            console.log('4');
            console.log(firstCard);
            firstCard.backgroundImage = "url(" + firstCard.index + ")"; // 1枚目のbgを変更
            socket.emit('server_to_client_firstCard',firstCard); // 変更したあとの情報をおくる
            console.log('firstCard情報送ったよ');
            return;
        }

        // console.log(flipedCard.id, e.srcElement.id);
        console.log("flipedCard.idは");
        console.log(flipedCard.id);
        console.log("firstCard.idは");
        console.log(firstCard.id);
        
        if (flipedCard.id == firstCard.id){
            return;
        } 
        
        if(flipedCard.number == num){ // ２枚のカードの数字が同じ場合
            console.log('4');
            flipedCard.backgroundImage = "url(" + e.srcElement.index + ")";
            // socket.emit('server_to_client_sameCard', flipedCard); // 変更したあとの情報をおくる
            flipedCard = null;
        } else { // カードの数字が違う場合
            console.log('5');
            e.srcElement.style.backgroundImage = "url(" + e.srcElement.index + ")";
            setTimeout(function () {
                firstCard.style.backgroundImage = "url(trump/png/z01.png)";
                flipedCard.style.backgroundImage = "url(trump/png/z01.png)";
                flipedCard = null;
            }, 1000);
        }


        // // 同じカードを２回クリックしても反応しない
        // if(flipedCard.id == firstCard.id){
        //     return;
        // }
        // if(flipedCard.number == num){ // ２枚のカードの数字が同じ場合
        //     console.log('3');
        //     flipedCard.backgroundImage = "url(" + e.srcElement.index + ")";
        //     // socket.emit('server_to_client_sameCard', flipedCard); // 変更したあとの情報をおくる
        //     flipedCard = null;
        // } else { // カードの数字が違う場合
        //     console.log('4');
        //     e.srcElement.style.backgroundImage = "url(" + e.srcElement.index + ")";
        //     setTimeout(function () {
        //         firstCard.style.backgroundImage = "url(trump/png/z01.png)";
        //         flipedCard.style.backgroundImage = "url(trump/png/z01.png)";
        //         flipedCard = null;
        //     }, 1000);
        // }
    });
});

// 生成したカードをシャッフル
function shuffle(cards){
    console.log("shuffleです。cards受け取りました。");
    // console.log(cards.length);
    console.log("shuffleするよ");
    // console.log(cards);
    for(var i = cards.length - 1; i >= 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = cards[i];
        cards[i] = cards[r];
        cards[r] = tmp;
    }
    // console.log(cards);
    console.log("cards情報送るよ");
    io.sockets.emit('server_to_client_draw', {value : cards});
    console.log("cards情報送った！");
}