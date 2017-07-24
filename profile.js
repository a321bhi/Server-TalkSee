var app = require('express')();
var http = require('http').Server(app);
//var addusers = require(__dirname+'\\addusers.js');
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://TalkAdmin:talkseepasss@localhost:27017/TalkSee';
var bodyParser = require('body-parser');
//for Android
app.use(bodyParser.urlencoded({ extended: true }));
//for POSTMAN
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
var assert = require('assert');
var nicknames = {};
var clients = [];
var namesUsed = [];
var activeNames = [];
var usersInRoom = [];
var ind = 0;
app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
});

// Route path: /users/:userId/books/:bookId
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
// To define routes with route parameters, simply specify the route parameters in the path of the route as shown below.
//
// app.get('/users/:userId/books/:bookId', function (req, res) {
//   res.send(req.params)
// })

//
// Method	Description
// res.download()	Prompt a file to be downloaded.
// res.end()	End the response process.
// res.json()	Send a JSON response.
// res.jsonp()	Send a JSON response with JSONP support.
// res.redirect()	Redirect a request.
// res.render()	Render a view template.
// res.send()	Send a response of various types.
// res.sendFile()	Send a file as an octet stream.
// res.sendStatus()	Set the response status code and send its string representation as the response body.


//app.get('/user/:id', function(req, res){
//   res.send('user ' + req.params.id);
// });

app.get('/test/user/:user', function(req, res){
  var params = req.params;
  console.log(params['user']);
  res.send(params['user']);
});
app.post('/ch', function(req, res){
var user = req.body.username;
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');

      var cursor = collectionOfUsers.find({username:user});
      cursor.each(function(err,doc){
        if(err){
          console.log(err);
        }else {
          if(doc == null){
            console.log('Username is available');
          }else{
            //
            console.log("User Already Exists!")
          }
        }
      });
      db.close();
  });
});
app.post('/ad', function(req, res){
  var user = req.body.username;
  var pass = req.body.password;
  var full = req.body.fullname;
  var d = req.body.dob;
  var em = req.body.email;
  var gen = req.body.gender;
  console.log(user);
  console.log(pass);
  console.log(em);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');
    var user1 = {username: user, password: pass, fullname: full, dob:d, email:em, gender: gen, rating: "noRating",numRated:0};
    //numRated is total number of ppl who rated
//check if username exists
  collectionOfUsers.findOne({username: user},function(err, doc) {
    if (err) {
      console.log(err);
    }
    else if(doc!=null){
      console.log('Username exists!');
      //res.send('Username Already Exists!');
      res.send('a');
      db.close();
      }else{
        collectionOfUsers.findOne({email: em},function(err1,doc1){
          if (err1) {
            console.log(err1);
          }
          else if(doc1!=null){
            console.log('Email exists!');
            // res.send('Email Already Exists!');
            res.send('b');
            db.close();
          }else {
            // Insert some users
            collectionOfUsers.insert(user1, function (err2, result) {
              if (err2) {
                console.log(err2);
              } else {
                console.log('Registration Successful!');
                // res.send('Success!');
                res.send('c');
                db.close();
              }
            });
          }
        });
      }
    });
  });
});
app.post('/rt', function(req, res){
  var user = req.body.username;
  var pass = req.body.password;
  console.log(user);
  console.log(pass);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');

      // var cursor = collectionOfUsers.find({username:user});
      // cursor.each(function(err,doc){
      //   if(err){
      //     console.log(err);
      //       res.status(500).send('Something broke!');
      //   }else {
      //     if(doc == null){
      //       res.json({isLoggedIn:false});
      //     }else{
      //       res.send(doc);
      //     }
      //   }
      // });
// collectionOfUsers.find({username:user}, function (err, result) });
//   var cursor =db.collection('TalkSeeUsers').find({username:user},{password:pass});
//  cursor.each(function(err, doc) {
//     assert.equal(err, null);
//     if (doc != null) {console.log(doc);
//        res.send(doc);
//     } else {
//        //
//     }
//  });
    collectionOfUsers.find({username:user,password:pass}).toArray(function (err, result) {
     if (err) {
       console.log(err);
       res.status(500).send('Something broke!');
     } else if (result.length) {
       console.log(result);
       res.send(result);
     } else {
       console.log('Wrong Username or Password');
       res.send("unsuc");
     }});

  db.close();
});
});



app.post('/rt_profile', function(req, res){
  var user = req.body.username;
  console.log(user);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');

    collectionOfUsers.find({username:user}).toArray(function (err, result) {
     if (err) {
       console.log(err);
       res.status(500).send('Something broke!');
     } else if (result.length) {
       console.log(result);
       res.send(result);
     } else {
       console.log('Wrong Username');
       res.send("unsuc");
     }});

  db.close();
});
});

app.post('/profileForConfirmation', function(req, res){
  var user = req.body.username;
  console.log(user);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');

    collectionOfUsers.find({username:user}).toArray(function (err, result) {
     if (err) {
       console.log(err);
       res.status(500).send('Something broke!');
     } else if (result.length) {
      //  console.log(result);
      var ans=result[0].username+" "+result[0].gender+" "+result[0].rating+" "+result[0].numRated;
       res.send(ans);
     } else {
       console.log('Wrong Username');
       res.send("unsuc");
     }});

  db.close();
});
});


app.post('/addRating', function(req, res){
  var user = req.body.username;
  var rating = req.body.rating;
  console.log(user);
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } //only for testing:
    else{
          console.log('Connection established to', url);
    }
    var collectionOfUsers = db.collection('TalkSeeUsers');

    collectionOfUsers.find({username:user}).toArray(function (err, result) {
     if (err) {
       console.log(err);
       res.status(500).send('Something broke!');
     } else if (result.length) {
       console.log(result);
       var r = result.rating;
       var newR = (r+rating)/2;
       collectionOfUsers.update({username:user},{$set:{rating:newR},$inc:{numRated:1}});
       res.send("");
       //res.send(result);
     } else {
       console.log('Wrong Username');
       res.send("unsuc");
     }});

  db.close();
});
});




http.listen(3001, function(){
  console.log('listening on *:3001');
});
