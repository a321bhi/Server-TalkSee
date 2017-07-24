// using database FriendList for this

var app = require('express')();
var http = require('http').Server(app);
//var addusers = require(__dirname+'\\addusers.js');
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://TalkAdmin:talkseepasss@localhost:27017/FriendList';
var bodyParser = require('body-parser');
//for Android
//app.use(bodyParser.urlencoded({ extended: true }));
//for POSTMAN
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
var assert = require('assert');
app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
});
app.post('/adst', function(req, res){
  var user = req.body.username;
  var stranger = req.body.Sname;
  console.log(user);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfRequests = db.collection('FriendRequests');
    var date = new Date();
    collectionOfRequests.insert({f1:user,f2:stranger,time:date.getTime()},function(err,success){
      if(err){
        console.log("Error");
        db.close();
      }else {
        console.log("Success");
        db.close();
      }
});
});
});

http.listen(3004, function(){
  console.log('listening on *:3004');
});
