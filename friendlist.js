 // using database FriendList for this

var app = require('express')();
var http = require('http').Server(app);
//var addusers = require(__dirname+'\\addusers.js');
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://TalkAdmin:talkseepasss@localhost:27017/FriendList';
//var url = 'mongodb://localhost:27017/FriendList';
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

app.post('/adToRq', function(req, res){
  var user = req.body.username;
  var st = req.body.st;
  var t = req.body.time;
  console.log(user);
  console.log(st);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfFL = db.collection('FriendRequests');
    var set1 = {f1: user, f2:st, accepted:"false", notified:"false", time:t};
    collectionOfFL.insert(set1, function (err11, result) {
    if (err11) {
        console.log(err11);
    } else {
        console.log('Request added!');
                // res.send('Success!');
            res.send('success');
            db.close();
    }
    });
    });
  });


app.post('/adToFL', function(req, res){
  var user = req.body.username;
  var fr = req.body.f;
  console.log(user);
  console.log(fr);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var d = new Date(milliseconds);
    var collectionOfFL = db.collection('FriendList');
    var set1 = {username: user, f:fr, time:d};
    var set2 = {username: fr, f:user, time:d};
    var collectionOfFR = db.collection('FriendRequests');
    collectionOfFL.insert(set1, function (err2, result) {
    if (err2) {
        console.log(err2);
    } else {
        console.log('Set 1 added!');
                // res.send('Success!');
        collectionOfFL.insert(set2, function(err9,result){
          if(err9){
            console.log(err9);
          }else {
            console.log("Set 2 added");
            res.send('success');
            var set3 = {f1: fr, f2:user};
            collectionOfFR.update(set3, {$set:{accepted:"true"}});
            db.close();
          }
        });
    }
    });
    });
  });


app.post('/fl', function(req, res){
  var user = req.body.username;
  console.log(user);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('FriendList');
    var friends ="";
    var a=false;
        var cursor = collectionOfUsers.find({username:user}).sort({f:1});
          cursor.each(function(err,doc){
            if(err){
              console.log(err);
                res.status(500).send('Something broke!');
            }else {
              if(doc == null){
                if(a==false){
                  console.log("no friends");
                  res.send("");

                }
                if(a==true){
                  console.log(friends);
                    res.send(friends);
                    a= false;
                }
              }else{
                a=true;
                friends+=" "+doc.f;
                // res.send(doc);
              }
            }
          });
    // var collectionOfUsers = db.collection('FriendList');
    // collectionOfUsers.find({username:user}).toArray(function (err, result) {
    //  if (err) {
    //    console.log(err);
    //    res.status(500).send('Something broke!');
    //  } else if (result.length) {
    //    console.log(result);
    //    res.send(result);
    //  } else {
    //    res.send("none");
    //  }});

  db.close();
});
});

http.listen(3002, function(){
  console.log('listening on *:3002');
});
