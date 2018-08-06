// 必要なモジュールの読み込み
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
// HTTPサーバを生成
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/flipcard.html', 'utf-8'));
}).listen(3000);  // ポート競合の場合は値を変更
// HTTPサーバにソケットをひもづける（WebSocket有効化）
var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {
    console.log('1');
    socket.on('client_to_server', function(data) {
        console.log('2');
        io.sockets.emit('server_to_client', {value : data.value});
        console.log('3');
    });
    socket.on("client_to_server", function(cards){
        for(var i = cards.length - 1; i > 0; i--){
            var r = Math.floor(Math.random() * (i + 1));
            var tmp = cards[i];
            cards[i] = cards[r];
            cards[r] = tmp;
        }
        console.log(cards);
    
    });
    socket.on("client_to_server_draw", function(field){
        field.innerHTML = "";
        for (var i = 0; i < 4; i++){
            var tr = document.createElement("tr");
            for (var j = 0; j < 13; j++){
                td = document.createElement("td");
                var index = i * 13 + j;
                var id = cards[index].mark; // シャッフルした配列から指定する
                td.className = "card close";
                td.id = id;
                var src = 'trump/png/'+id+'.png';
                td.index = src;
                // td.style.backgroundImage = "url( trump/png/.png )";
                td.textContent = id;
                td.number = cards[index].number;
                td.onclick = click;
                tr.appendChild(td);
            }
            field.appendChild(tr);
        }
    });
    
});

