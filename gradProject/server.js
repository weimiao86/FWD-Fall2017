var express = require('express');
var app = express();
var mysql = require('mysql');
var dbconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '1234',
  database : 'pingyuan2'
});
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

dbconnection.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});
//dbconnection.end();

// Binding express app to port 3000
app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});

app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.use('/css',  express.static(__dirname + '/css'));

app.use('/img',  express.static(__dirname + '/img'));

app.use('/js',  express.static(__dirname + '/js'));

app.get('/',function(req,res){
    res.sendFile('grad.html',{'root': __dirname + '/index'});
})
app.get('/showabout',function(req,res){
    res.sendFile('about.html',{'root': __dirname + '/index'});
})
app.get('/showhelp',function(req,res){
    res.sendFile('help.html',{'root': __dirname + '/index'});
})

app.post("/query", function(req, res){
  var sqlQuery=req.body.qstr;
  dbconnection.query(sqlQuery, function(err, rows, fields) {
   if (err) throw err;
    var jsonString = JSON.stringify(rows);
    res.json(jsonString);
  });
});
