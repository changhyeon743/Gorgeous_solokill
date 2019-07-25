var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./statics/config').config;
const mongoose = require('mongoose')
///
const app = express();
var server = require('http').createServer(app).listen(config.port, function(){
  console.log("Express server listening on port " + config.port);
});

var io = require('socket.io').listen(server);
///
const game = {};
///
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'node_modules')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

///
app.get('/test',(req,res)=> {
  //res.send("aa");
  res.sendFile(__dirname + '/test.html');
})



mongoose.connect(`mongodb://localhost:27017/${config.db.name}`, {
	useNewUrlParser: true
});

const userSchema = mongoose.Schema({
	  name: String
});

const userModel = mongoose.model("user", userSchema);


io.set('origins', '*:*')
io.on('connection', socket => {
    //console.log(socket, ": connected")
    
    // 접속한 클라이언트의 정보가 수신되면
    socket.on('hello', function(data) {
      console.log('Client logged-in:\n name:' + data.name);
      // 접속된 모든 클라이언트에게 메시지를 전송한다
      io.emit('hello', data.name );
    });

    socket.on('disconnection',()=> {console.log("bye")})
})


module.exports = app;
