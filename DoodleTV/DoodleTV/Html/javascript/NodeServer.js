//////////

var express = require('express')
var app = express();
app.use(express.static(__dirname));
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
	res.sendfile('Display.html');
});

io.on('connection', function (socket) {
	console.log('a user connected');

	socket.on('message',function(event){ 
		console.log('Received message from client!', event)
	});

	socket.on('image', function (dataUrl) {
		
		console.log(dataUrl);
		var fs = require("node-fs");
		var buffer = new Buffer(dataUrl, "base64")
		var fileName = __dirname + "\\3SWAG.png";

		fs.open(fileName, 'a', 0755, function (err, fd) {
			console.log(fileName);
			if (err) throw err;

			fs.writeFile(fileName, dataUrl.split(",")[1], { "encoding": "base64" }, function (err, written, buff) {
				fs.close(fd, function () {
					console.log("File saved :)");
				});
			})
		});

		//io.emit('image', dataUrl);

		
	});
});

http.listen(3000, function () {
	console.log('listening on *:3000');
});