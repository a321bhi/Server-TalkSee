var socketIO = require('socket.io');
var server = require('http').createServer().listen(7000,'0.0.0.0');
var io = socketIO.listen(server);

//one room only
//we expect two ppl max
//no error handling
var users=[];
var socks=[];
var ids=[];
var too= [];
//io.sockets.on('connection',function(client){
io.on('connection',function(client){
  console.log('new connection : ' + client.id);
//new code
  client.on('username',function(data){
      if(users.indexOf(data.username)==-1){
        users.push(data.username);
        var indexx=users.indexOf(data.username);
        ids[indexx]=client.id;
        socks[indexx]=client;
        too[indexx]= data.to;
        console.log(usersInRoom);
    }else{
      console.log('already exists');
    }
    if(users.indexOf(too[indexx])!=-1){
    var otherClient = socks[users.indexOf(too[indexx])];
    otherClient.emit('createoffer',{});}
    else {

    }
//new code ends
  });

client.on('offer', function(details) {
  var indexx = ids.indexOf(client.id);
  if(users.indexOf(too[indexx])!=-1){
  var otherClient = socks[users.indexOf(too[indexx])];
  otherClient.emit('offer',details);
  console.log('offer : '+JSON.stringify(details));
}else {

}
});

client.on('answer',function(details){
  var indexx = ids.indexOf(client.id);
  if(users.indexOf(too[indexx])!=-1){
  var otherClient = socks[users.indexOf(too[indexx])];
  otherClient.emit('answer',details);
  console.log('answer : '+JSON.stringify(details));
}else{

}
});

client.on('candidate',function(details){
  var indexx = ids.indexOf(client.id);
  if(users.indexOf(too[indexx])!=-1){
  var otherClient = socks[users.indexOf(too[indexx])];
  otherClient.emit('candidate',details);
  console.log('candidate : '+JSON.stringify(details));
}
  else {

  }
});
client.on('disconnect', function(data){
  var indexx = ids.indexOf(client.id);
   users.plice(indexx,1);
   socks.splice(indexx,1);
   toos.splice(indexx,1);
   ids.splice(indexx,1);
   console.log('user disconnected '+users);
   //console.log('\n'+socketOfClients);
});
//the first connection doesnt send anything (no other clients)
//second connection emits the message

});
/*
io.socket.on('connection',function(client){
  console.log('new connection : ' + client.id);

  client.on('offer', function(details) {
    client.broadcast.emit('offer',details);
    console.log('offer : '+JSON.stringify(details));
  });

  client.on('answer',function(details){
    client.broadcast.emit('answer',details);
    console.log('answer : '+JSON.stringify(details));
  });

  client.on('candidate',function(details){
    client.broadcast.emit('candidate',details);
    console.log('candidate : '+JSON.stringify(details));
  });
//the first connection doesnt send anything (no other clients)
//second connection emits the message
client.broadcast.emit('createoffer',{});
});
*/
