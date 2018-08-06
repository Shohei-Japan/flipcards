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