var levelup = require('levelup');
var db = require('levelup')('./data');
var sha256 = require('js-sha256');

var time = 0;
server = require('http').createServer((req, res) => {

  if(req.url === '/icon.png' || req.url === '/README.md' || req.url === '/index.html') {
    res.end(require('fs').readFileSync(req.url.slice(1)));
    return;

  } else if(req.url.startsWith('/hash')) {
    if(req.method === 'POST') {
      var data = '';
      req.on('data', chunk => data += chunk.toString());
      req.on('end', () => {
        if(data.length > 60000) {
          console.log('big data.length', data.length, id);
          res.statusCode = 413;
          res.end();
        } else {
          var id =  sha256(data).slice(0,24);
          db.put(id, data, err => {
            if(err) {
              console.log(err);
              res.end();
            }
            res.end(id);
          });
        }
      });
    } else {
      var id = req.url.slice(6);
      db.get(id, (err, val) => {
        if(err) {
          console.log(err);
          res.statusCode = 404;
          res.end();
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31557600');
          res.end(val);
        }
      });
    }
  } else {
    res.statusCode = 404;
    res.end('');
  }
});

server.listen(8888);
