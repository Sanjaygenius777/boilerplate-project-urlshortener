require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

var count = 0;
const urlmap = {}
app.post('/api/shorturl', (req, res) => {
  const regex = /^https?:\/\/.+/i
  if (!regex.test(req.body.url)) {
    res.json({ "error": 'invalid url' })
  } else {
    count += 1
    urlmap[count] = req.body.url
    res.json({ "original_url": req.body.url, "short_url": count })
  }
})

app.get('/api/shorturl/:id', (req, res) => {
  if (!(req.params.id in urlmap)) {
    res.json({ "error": "No short URL found for the given input" })
  } else {
    const url = urlmap[req.params.id]
    res.redirect(url)
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
