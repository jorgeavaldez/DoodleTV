//////////

var express = require('express')
var app = express();
app.use(express.static(__dirname));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var curImg = 1;

app.get('/', function (req, res) {
	res.sendfile('Display.html');
});

io.on('connection', function (socket) {
	console.log('User connected...');

	socket.on('message',function(event){ 
		console.log('Client message...', event)
	});

	socket.on('image', function (dataUrl) {
		
		//console.log(dataUrl);
		var fs = require("node-fs");
		var buffer = new Buffer(dataUrl, "base64")
		var fileName = __dirname + "\\p" + curImg + ".png";
		curImg++;

		if (curImg > 5)
		{
			curImg = 1;
		}

		fs.open(fileName, 'a', 0755, function (err, fd) {
			//console.log(fileName);
			if (err) throw err;

			fs.writeFile(fileName, dataUrl.split(",")[1], { "encoding": "base64" }, function (err, written, buff) {
				fs.close(fd, function () {
					console.log("File " + fileName + " saved :D");
				});
			})
		});

		//io.emit('image', dataUrl);

		
	});
});

http.listen(3000, function () {
	console.log('listening on *:3000');
});