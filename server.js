var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var myMap = new Map();

io.on('connection', function(socket){
  socket.on('user',function(data){
    console.log(data + ' connected to chat bot at '+new Date());
    myMap.set(data,socket);
  });
  socket.on('message',function(data){
    if(myMap.has(data.friend)){
      myMap.get(data.friend).emit('rxMsg',data.message);
    }
    else{
      socket.emit('offline','user offline');
    }
  });
  socket.on('disconnect',function(){
    console.log('disconnect');
    removeUser(socket.client.conn.id);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});

function removeUser(id){
  myMap.forEach(function(value,key){
    if(id == value.client.conn.id){
      myMap.delete(key);
    }
  });
}
