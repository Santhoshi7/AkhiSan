if(process.argv[2]== null || process.argv[3]== null){
  console.log('please enter your name and your friends name after "node client.js " and use only small letters');
  console.log('for example');
  console.log('node client.js akshay santhu');

  return 1;
}

var name = process.argv[2];
var friend = process.argv[3];
 var prompt = require('prompt');
 var socket = require('socket.io-client')('http://localhost:8000');
 var colors = require('colors');

 colors.setTheme({
   silly: 'rainbow',
   input: 'grey',
   verbose: 'italic',
   prompt: 'magenta',
   info: 'green',
   data: 'gray',
   help: 'white',
   warn: 'yellow',
   debug: 'blue',
   error: 'red'
 });

 var schema = {
   properties: {
     message: {
       pattern: /^[a-zA-Z\s\-]+$/,
       message: 'Name must be only letters, spaces, or dashes',
       required: true
     }
   }
 };

 new Promise(function(resolve, reject) {
   socket.on('connect', function(){
     console.log(('you have been connected to server').error.underline.italic);
     socket.emit('user',name);
     resolve('true');
   });
 }).then(function(data){
   prompter(data);
   process.stdout.write("\r\x1b[K");
 });

socket.on('offline',function(data){
  console.log((data).red.italic);
});
socket.on('rxMsg',function(data){
   console.log((friend+':').magenta.italic + (data).green.italic);
})

function prompter(data){
  prompt.start();
  prompt.get(schema, function (err, result) {
   process.stdout.write("\r\x1b[K");
  //  console.log((name+':').magenta.italic + (result.message).green.italic);
   socket.emit('message',{friend:friend, message:result.message});
   prompter(data);
   process.stdout.write("\r\x1b[K");
  });
}
