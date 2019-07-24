var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames=[];//this array will contain all usernames + colors

app.get('/', function(req, res) {
   res.header('Access-Control-Allow-Origin', '*');
   res.sendFile('C:/wamp64/www/chat/index2.html');
   app.use(express.static("public"));
});

io.on('connect',function(socket){//hande user connection
   
   
   socket.on('sendMessage',function(data){//handle when user sends message
      io.emit('messageReply',{name:data.name,text:data.text+"<br>",textColor:usernames[data.name]});
   });

   socket.on('pickUsername',function(data){//act accordingly when user chooess an id
      if(usernames[data.name]!=undefined)//if usernames['name'] is undefined, it means that this name does not exist
      {
         socket.emit('usernameTaken');//says that the username is taken
      }
      else
      {
         usernames[data.name]=data.textColor;//assigns a color to the specoified name
         socket.emit('usernameGranted');//lets the client know that it's been accepted
         socket.broadcast.emit('newUser', "A new user has arrived!Please welcome "+data.name);
         //tells to the other clients that we have a new user
      }
   });

   socket.on('changeUserColor',function(data){//handles the case in which client wants his chat color to change
      if(usernames[data.name]!=undefined)
      {
         usernames[data.name]=data.color;//changes the color
         io.sockets.emit('colorChangeApproval');//informs that it's changed
      }
   });
   
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});
