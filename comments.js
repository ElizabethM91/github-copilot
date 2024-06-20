// Create web server
// Create a web server that listens on port 3000
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const comments = require('./comments');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (req.method === 'GET' && pathname === '/comments') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  } else if (req.method === 'POST' && pathname === '/comments') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const newComment = JSON.parse(body);
      comments.push(newComment);
      res.end(JSON.stringify(newComment));
    });
  } else {
    const filename = path.join(__dirname, 'public', pathname);
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
  }
});

server.listen(3000);
console.log('Server running at http://localhost:3000/');