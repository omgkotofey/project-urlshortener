
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const url_manager = require('./app.js').ShortUrlManager;

const app = express();

// Basic Configuration
const port = process.env['PORT'] || 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  return res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  return res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', urlencodedParser, (req, res) => {
  original_url = req.body.url;

  if (!original_url) {
    return res
      .status(400)
      .json({
        error: 'no url given'
      });
  }

  url_manager
  .createUrl(original_url)
  .then(
    (url) => res.json({
      original_url: url.original_url,
      short_url: url.short_url
    })
  ).catch((err) => 
    res
    .status(400)
    .json({
      error: 'invalid url'
    }));
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
