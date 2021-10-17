var express          = require('express');
//var bodyParser       = require('body-parser');
var path             = require('path');
var app              = express();

var log = console.log;
console.log = function (){log.apply(console, [new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')].concat(arguments));};

app.use( express.static( path.join(__dirname,'build') ) );

app.get('/ping',function(p_req, p_res){
   console.log( "logging pong" );
   return p_res.send('pong');
});

app.get('/*',function(p_req, p_res){
   console.log( "loading react app" );
   p_res.sendFile( path.join(__dirname, 'build', 'index.html') );
});

app.listen( process.env.PORT || 3000 );