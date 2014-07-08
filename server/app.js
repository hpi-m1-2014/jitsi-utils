var express = require('express'),
    morgan  = require('morgan'),
    serve   = require('serve-static'),
    glob    = require('glob'),
    exec    = require('child_process').exec,
    path    = require('path'),
    fs      = require('fs');

// Argument handling

var basedir = path.resolve(process.argv[2]);

if (!basedir) {
  console.error('Usage: node app.js <recordings-directory>');
  process.exit(1);
}

if (!fs.existsSync(basedir)) {
  console.error('Could not find directory "%s"', basedir);
  process.exit(1);
}

// Configure the application

var app = express();
var port = 8082;

// app.enable('trust proxy');

app.use(morgan('default'));
app.use(serve('public', {index: ['index.htm', 'index.html']}));
app.use('/files', serve(basedir, {}));

app.get('/api/conferences.json', function (req, res) {
  glob('*/metadata.json', {cwd: basedir}, function (err, matches) {
    if (err) return res.json(500, {error: err});
    res.json(matches.map(function (path) {
      return {id: path.split('/')[0]};
    }));
  });
});

app.get('/api/conferences/:id.json', function (req, res) {
  var options = {encoding: 'utf-8'},
      id = req.params.id;

  var metafile = path.join(basedir, id, 'metadata.json');

  fs.readFile(metafile, options, function (err, data) {
    if (err) return res.json(500, {error: err});
    fs.exists(path.join(basedir, id, 'mixed.webm'), function (exists) {
      var info = {id: id, metadata: JSON.parse(data)};
      if (exists) info.src = path.join('/files', id, 'mixed.webm');
      res.json(info);
    });
  });
});

app.post('/api/conferences/:id/actions/mix.json', function (req, res) {
  var id = req.params.id;

  var cmd = '../scripts/mixall "' + path.join(basedir, id) + '"';

  exec(cmd, function (err, stdout, stderr) {
    if (err) return res.json(500, {error: err});
    res.redirect('/api/conferences/' + id + '.json');
  });
});

// Launch the application

var server = app.listen(port, function () {
  console.log('Listening on port %d', server.address().port);
});
