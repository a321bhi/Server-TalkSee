// using database FriendList for this

var app = require('express')();
var http = require('http').Server(app);
//var addusers = require(__dirname+'\\addusers.js');
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://TalkAdmin:talkseepasss@localhost:27017/TalkSee';
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
app.post('/adusr', function(req, res){
  var Tfull = req.body.fullname;
  var Tuser = req.body.username;
  var Temail = req.body.email;
  var Tdob = req.body.dob;
  var Tgen = req.body.gender;
  var Tpass = req.body.password;
  console.log(user);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');
    var date = new Date();
    collectionOfUsers.insert({fullname: Tfull, username : Tuser, email: Temail, dob: Tdob, gender: Tgen, password: Tpass, time:date.getTime()},function(err,success){
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

http.listen(3005, function(){
  console.log('listening on *:3005');
});
