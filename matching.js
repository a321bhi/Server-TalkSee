// using database Matching for this
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://TalkAdmin:talkseepasss@localhost:27017/Matching';
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
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
              };



app.post('/mg', function(req, res){
  var user = req.body.username;
  var gen = req.body.gender;
  var pref = req.body.pref;
  MongoClient.connect(url,options,function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfBuffer = db.collection('Matching');
    collectionOfBuffer.insert({username:user,gender:gen,preference:pref},function(err,doc9){if(err){console.log(err);}else{console.log("inserted");}});
    var collectionOfMatches = db.collection('Matches');
    collectionOfMatches.findOne({match:user},function(err,doc10){
      if(doc10 == null){
        var friends ="";
        var a=false;
          collectionOfBuffer.findOne({$and:[{gender:pref},{preference:gen},{username:{$not : /user/}}]},function(err,doc){
            if(err){
              console.log(err);
              db.close();
                res.status(500).send('Something broke!');
            }else {
              if(doc == null){
                if(a==false){
                  db.close();
                  console.log("no one");
                  res.status(500).send("");
                }
                if(a==true){
                    a= false;
                }
              }else{
                a=true;
                var found = doc.username;
                  collectionOfMatches.findOne({$or:[{username:found},{match:found}]},function(err,doc1){
                    if(doc1 == null){
                      collectionOfMatches.insert({username:user, match:found},function(err,doc11){
                        collectionOfBuffer.deleteOne({username:found},function(err,doc12){
                          collectionOfBuffer.deleteOne({username:user},function(err,doc13){
                            console.log("Username "+found);
                              res.send("Username "+found);
                              db.close();
                          });
                        });
                      });
                    }else{db.close();console.log(found+" Present in Match collection");}
                  });
                }
            }
          });
        }else {
                var found = doc10.username;
                collectionOfBuffer.deleteOne({username:user},function(err,doc99){
                collectionOfBuffer.deleteOne({username:found},function(err,doc98){
                  db.close();
                  res.send("Username "+found);
                });
                });
        }
      });
});
});


//This code does not add and only checks
app.post('/mg1', function(req, res){
  var user = req.body.username;
  var gen = req.body.gender;
  var pref = req.body.pref;
  MongoClient.connect(url,options, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else{
          console.log('Connection established to', url);
    }
    var collectionOfBuffer = db.collection('Matching');
    var collectionOfMatches = db.collection('Matches');
    collectionOfMatches.findOne({match:user},function(err,doc10){
      if(doc10== null){
    var friends ="";
    var a=false;
    //gender=gen and preference= pref and username != user and a match table
        //var cursor =
        collectionOfBuffer.findOne({$and:[{gender:pref},{preference:gen},{username:{$not : /user/}}]},function(err,doc){
            //cursor.each(function(err,doc){
              if(err){
                console.log(err);
                db.close();
                res.status(500).send('Something broke!');
              }else {
                if(doc == null){
                  if(a==false){
                    console.log("no one");
                    db.close();
                    res.status(500).send("");
                  }
                  if(a==true){
                    console.log("LOL");
                      a= false;
                  }
                }else{
                  a=true;
                    var found = doc.username;
                  collectionOfMatches.findOne({$or:[{username:found},{match:found}]},function(err,doc4){
                    if(doc4 == null){
                      collectionOfMatches.insert({username:user, match:doc.username},function(err,doc5){
                      collectionOfBuffer.deleteOne({username:doc.username},function(err,doc6){
                        collectionOfBuffer.deleteOne({username:user});
                        db.close();
                        res.send("Username "+found);
                      });
                    });
                }else{
                  console.log(found+" present in Collection");
                  db.close();
                }
              });
                }
              }
            //});
        });
        }
        else {
          var found = doc10.username;
              collectionOfBuffer.deleteOne({username:user},function(err,doc7){
                  collectionOfBuffer.deleteOne({username:doc10.username},function(err,doc98){
                    db.close();
                    res.send("Username "+found);
                  });
            });
          }
        });
      });
});
app.post('/mg_del', function(req, res){
  var user = req.body.username;
    MongoClient.connect(url,options,function (err, db) {
      if (err) {
        console.log('Deletion Unable to connect to the mongoDB server. Error:', err);
        res.status(500).send("Error!");
      }
      else{
            console.log('Deletion Connection established to', url);
      }
      var collectionOfBuffer = db.collection('Matching');
      collectionOfBuffer.remove({username:user});
      res.send("success!");
    });
});

app.post('/mg_delFromMatch', function(req, res){
  var user = req.body.username;
    MongoClient.connect(url,options,function (err, db) {
      if (err) {
        console.log('Deletion Unable to connect to the mongoDB server. Error:', err);
        res.status(500).send("Error!");
      }
      else{
            console.log('Deletion Connection established to', url);
      }
      var collectionOfMatches = db.collection('Matches');
      //collectionOfMatches.remove({$or:[{username:user},{match:user}]});
      collectionOfMatches.remove({match:user});
      res.send("success!");
    });
});



http.listen(3003, function(){
  console.log('listening on *:3003');
});
