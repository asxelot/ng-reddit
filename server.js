var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

mongoose
  .connect('mongodb://localhost/ng-reddit')
  .connection
    .on('error', console.error.bind(console, 'connection error: '))
    .once('open', function() {
      console.log('Connected to DB');
    })
;

app.use(bodyParser.json());
app.use('/api', require('./api'));

app.listen(8080, function() {
  console.log('App listening');
});