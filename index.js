var express = require('express');
var app = express();
const path = require('path');
var db = require('./db');



var router = require('./books/router');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+ '/public/index.html'))
});

app.use('/api', router);

var port = "8080";

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});