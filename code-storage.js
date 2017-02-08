var levelup = require('levelup');
var db = require('levelup')('./data');

var time = 0;
server = require('http').createServer((req, res) => {
  if(req.method === 'PUT') {
    var data = '';
    req.on('data', chunk => data += chunk.toString());
    req.on('end', () => {
      // make id, combining unique timestamp, and ip-address
      var ip = req.headers['x-real-ip'] || '0.0.0.0';
      ip = ip.split('.').map(Number);
      ip = Math.pow(36,7) + (ip[0] * 256 * 65536) + (ip[1] * 65536) + (ip[2] * 256) + ip[3]
      time = Math.max(Date.now(), time + 1);
      var id = time.toString(36) + ip.toString(36).slice(1);
      if(data.length > 60000) {
        console.log('big data.length', data.length, id);
        res.statusCode = 413;
        res.end();
      } else {
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
    var id = req.url.slice(1);
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
});

server.listen(8888);
