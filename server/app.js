var express = require('express'),
    static = require('serve-static'),
    morgan = require('morgan'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs');

var dir = process.argv[2];
if (dir) process.chdir(dir);

console.log('Starting in "%s"', process.cwd());

var app = express();
var port = 8082;

// app.enable('trust proxy');

app.use(morgan('default'));
app.use(static('public', {index: ['index.htm', 'index.html']}));

app.get('/api/conferences.json', function (req, res) {
  glob('*/metadata.json', function (err, matches) {
    if (err) return res.send(500, {error: err});
    res.send(matches.map(function (path) {
      return {id: path.split('/')[0]};
    }));
  });
});

app.get('/api/conferences/:id.json', function (req, res) {
  var options = {encoding: 'utf-8'};
  var id = req.params.id;

  fs.readFile(path.join(id, 'metadata.json'), options, function (err, data) {
    if (err) return res.send(500, {error: err});
    res.send({id: id, metadata: JSON.parse(data)});
  });
});

var server = app.listen(port, function () {
  console.log('Listening on port %d', server.address().port);
});
