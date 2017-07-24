var socketIO = require('socket.io');
var server = require('http').createServer().listen(7001,'0.0.0.0');
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

    client.on('matchConfirmation', function(details) {
      var caller = details.Caller;
      var callee = details.Callee;
      var sock = clients[match[caller]];
      //var caller = details.caller;
      sock.emit('matchConfirmation',details);
    });
    client.on('disconnect',function(details){
      var caller = details.Caller;
      var sock = clients[caller];
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
      });
});
