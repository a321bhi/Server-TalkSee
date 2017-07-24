var socketIO = require('socket.io');
var server = require('http').createServer().listen(7000,'0.0.0.0');
var io = socketIO.listen(server);

//one room only
//we expect two ppl max
//no error handling
//var clients = [];
var clients = new Array();
var activeNames = [];
var match = new Array();
var ind = 0;


//io.sockets.on('connection',function(client){
io.on('connection',function(client){
    console.log('new connection : ' + client.id);

    client.on('offer', function(details) {
      var caller = details.Caller;
      var callee = details.Callee;
      var sock = clients[match[caller]];
      //var caller = details.caller;
      sock.emit('offer',details);
      console.log('offer : '+JSON.stringify(details));
    });

    client.on('answer',function(details){
      var caller = details.Caller;
      var callee = details.Callee;
      var sock = clients[match[caller]];
    sock.emit('answer',details);
      console.log('answer : '+JSON.stringify(details));
    });

    client.on('candidate',function(details){
      var caller = details.Caller;
      var callee = details.Callee;
      var sock = clients[match[caller]];
      sock.emit('candidate',details);
      console.log('candidate : '+JSON.stringify(details));
    });
    client.on('disconnect',function(details){
      var caller = details.Caller;
      activeNames.splice(activeNames.indexOf(caller),1);
      delete match[caller];
      delete clients[caller];
    });

  client.on('registration' , function(cl){
    //Register Myself
    var callee = cl.Callee;
    var caller = cl.Caller;
    console.log(caller + " "+ callee);
    console.log(caller + " "+ callee);
    if(activeNames.indexOf(caller) == -1){//doesnt exist
      activeNames.push(caller);
      //ind = activeNames.indexOf(caller);
      match[caller]=callee;
      clients[caller] = client;
    }else{
      //already exists
    }
    //initiate call if the other person is present.
    if(activeNames.indexOf(callee) == -1){
      //user not yet here
    }else{
      var sock = clients[callee];
      sock.emit('createoffer',{});
    }
});
});











/*



io.on('connection', function(socket){

    console.log('a user connected');
    socket.on('on',function(data){
      if(activeNames.indexOf(data.username) == -1){
        console.log( activeNames.indexOf(data.username));
      ind = activeNames.push(data.username);
      clients[ind] = socket;
      nicknames[socket.id] = data.username;
      console.log(activeNames+" ind is "+ind);
      var username = data.username;
      }
      else{
        console.log('already exists');
      }
    });
      socket.on('offer', function(details) {
        console.log(activeNames);
        if(activeNames.indexOf(callee) != -1){
          var i = activeNames.indexOf(details.to);
          var sock = clients[i];
          sock.emit('offer',details);
          console.log('offer : '+JSON.stringify(details));
        }else{
          console.log("USER NOT ACTIVE!");
        }
      });

      client.on('answer',function(details){
        console.log(activeNames);
        if(activeNames.indexOf(callee) != -1){
          var i = activeNames.indexOf(details.to);
          var sock = clients[i];
        client.broadcast.emit('answer',details);
        console.log('answer : '+JSON.stringify(details));
      }else{
        console.log("USER NOT ACTIVE!");
      }
      });

      client.on('candidate',function(details){
        console.log(activeNames);
        if(activeNames.indexOf(callee) != -1){
          var i = activeNames.indexOf(details.to);
          var sock = clients[i];
        client.broadcast.emit('candidate',details);
        console.log('candidate : '+JSON.stringify(details));
      }else{
        console.log("USER NOT ACTIVE!");
      }
      });
    //the first connection doesnt send anything (no other clients)
    //second connection emits the message to start the SDP negotiation


  socket.on('Place a call', function(data){
    //data should have parameter as caller
    console.log('message: ' + data.message);
    //var from = nicknames[socket.id];
    console.log(activeNames);
    if(activeNames.indexOf(callee) != -1){
      var i = activeNames.indexOf(callee);
      var sock = clients[i];
      sock.emit('createoffer',{});
    }else{
      console.log("USER NOT ACTIVE!");
    }
  });
  socket.on('disconnect', function(){
      var a = activeNames.indexOf(nicknames[socket.id]);
      console.log('the user leaving is '+nicknames[socket.id]);
    //   delete nicknames[socket.id];
    //  delete clients[a];
     //delete activeNames[a];
    delete nicknames[socket.id];
     clients.splice(a,1);
     activeNames.splice(a,1);
     db.close();
     console.log('user disconnected');
  });
  });
});
function updateActiveStatus(socket){
  var usersInRoom = io.sockets.clients();
  if(usersInRoom==null){}else{

  for (var index in usersInRoom){
    var userSocketId = usersInRoom[index].id;
    if (userSocketId !== socket.id && nicknames[userSocketId]){
      var name = nicknames[userSocketId];
      activeNames.push({id: namesUsed.indexOf(name), nick: name});
    }
  }}
}
function CheckIfActive(name,socket){
  updateActiveStatus(socket);
  if(activeNames.indexOf(name)!==-1){
    return true;
  }else {
    return false;
  }
}
*/
