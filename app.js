const mongoose = require('mongoose');
var http = require('http');
var https = require('https');
const url = require('url');
const randomstring = require('randomstring');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true });

const ShortUrl = mongoose.model('ShortUrl', new mongoose.Schema({
  original_url: String,
  short_url: String,
}));

const UrlValidator = {
  validate: (givenUrl) => new Promise((resolve, reject) => {
    const url = new URL(givenUrl);
    resolve(url);
  })
  .then((url) => new Promise((resolve, reject) => {
    const httpClient = (url.protocol == "https:") ? https: http; 
    let request = httpClient.get(url, res => {
      
      if (!res.statusCode || res.statusCode >= 400) {
        reject(new Error('Status code'));
      }
      
      resolve()
    }).on('error', err => {
      reject(err);
    });

    request.setTimeout(3000, () => reject(new Error('Timeout')));
    
  }))
  .then(() => givenUrl)
}

const ShortUrlManager = {
  createUrl: (original_url, short_code = null) =>
    UrlValidator
      .validate(original_url)
      .then((original_url) => ShortUrl.create({
        original_url: original_url,
        short_url: short_code || randomstring.generate(7)
      }))
  ,

  findUrl: (short_url) =>
    ShortUrl.findOne({
      "short_url": short_url
    })
    .exec()
}

exports.ShortUrlModel = ShortUrl;
exports.ShortUrlManager = ShortUrlManager;