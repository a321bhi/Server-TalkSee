var app = require('express')();
var http = require('http').Server(app);
//var addusers = require(__dirname+'\\addusers.js');
var io = require('socket.io')(http, {'pingInterval':2000,'pingTimeout':5000});
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
//var url = 'mongodb://localhost:27017/TalkSee';
var url = 'mongodb://TalkAdmin:talkseepasss@localhost:27017/TalkSee';
//new code!
var nicknames = {};
var clients = [];
var namesUsed = [];
var activeNames = [];
var usersInRoom = {};
var ind = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/test', function(req, res){
  res.send('Test Successful');
});
app.get('/ep', function(req, res){

});
http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log(socket.handshake.query.name);
  var username = socket.handshake.query.name;
  //socket.emit('new message',{from: "ABC", to: "XYZ", message: "DEFHI"})
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } //only for testing:
      else{
            console.log('Connection established to', url);
      }
    //var collectionOfUsers = db.collection('users');
    var collectionOfMessages = db.collection('messages');
    console.log('a user connected');

      if(activeNames.indexOf(username) == -1){
      activeNames.push(username);
      ind = activeNames.indexOf(username);
      console.log("Index is "+ind+"  Index is "+activeNames.indexOf(username));
      //clients[ind] = socket;
      clients.push(socket);
      usersInRoom[username]= socket;
      nicknames[socket.id] = username;
      console.log(activeNames+" ind is "+ind);
      var cursor = collectionOfMessages.find({to: username});
      cursor.each(function(err,doc){
        if(err){
          console.log(err);
        }else {
          if(doc == null){}else{
            socket.emit('new message', {from: doc.from, to: doc.to, message: doc.message, time: doc.time});
            console.log(doc);
            collectionOfMessages.remove({_id:doc._id},function(e,d){if(e){console.log(e);}else{console.log("Deletion Success");}});
          }
        }
      });}
      else{
        console.log('already exists');
        var cursor = collectionOfMessages.find({to: username});
        cursor.each(function(err,doc){
          if(err){
            console.log(err);
          }else {
            if(doc == null){}else{
              socket.emit('new message', {from: doc.from, to: doc.to, message: doc.message, time: doc.time});
              console.log(doc);
              collectionOfMessages.remove({_id:doc._id},function(e,d){if(e){console.log(e);}else{console.log("Deletion Success");}});
            }
          }
        });
      }

  socket.on('new message', function(data){
    console.log('message: ' + data.message);
    //var from = nicknames[socket.id];
    console.log(activeNames);
    if(activeNames.indexOf(data.to) != -1){
      var i = activeNames.indexOf(data.to);
      //console.log(data+'hasoihfaisufash        '+i+'   sfasfas    '+clients[i]);
      //var sock = clients[i];
      var sock = usersInRoom[data.to];
      sock.emit('new message', {from: data.from, to: data.to, message: data.message, time : data.time});
    }else{
      //save in db
      var dbdata = {from:data.from, to:data.to, message: data.message, time: data.time};
      collectionOfMessages.insert(dbdata, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted documents into the "users" collection');
        }
      });
    }
  });
  socket.on('disconnect', function(){
      var a = activeNames.indexOf(nicknames[socket.id]);
      console.log('the user leaving is '+nicknames[socket.id]);
    //   delete nicknames[socket.id];
    //  delete clients[a];
     //delete activeNames[a];
     delete usersInRoom[nicknames[socket.id]];
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

function searchPerson() {
  for(var i = 0, len = nicknames.length; i < len; i++) {
    if (nicknames[i].hello === searchTerm) {
        index = i;
        break;
    }
}
}
