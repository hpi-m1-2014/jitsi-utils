var express = require('express'),
    static = require('serve-static'),
    morgan = require('morgan'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs');

var basedir = path.resolve(process.argv[2]);

if (!basedir) {
  // console.error(usage);
  process.exit(1);
}

if (!fs.existsSync(basedir)) {
  console.error('Could not find directory "%s"', basedir);
  process.exit(1);
}

var app = express();
var port = 8082;

// app.enable('trust proxy');

app.use(morgan('default'));
app.use(static('public', {index: ['index.htm', 'index.html']}));
app.use(static(basedir, {}));

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
    var src = path.join(id, 'mixed.flv');
    res.json({id: id, src: src, metadata: JSON.parse(data)});
  });
});

var server = app.listen(port, function () {
  console.log('Listening on port %d', server.address().port);
});
