const mongoose = require('mongoose');
const dns = require('dns');
const url = require('url');
const randomstring = require('randomstring');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true });

const ShortUrl = mongoose.model('ShortUrl', new mongoose.Schema({
  original_url: String,
  short_url: String,
}));

const UrlValidator = {
  validate: (givenUrl) => dns.promises.lookup(
    (new URL(givenUrl)).host,
    {
      hints: dns.ADDRCONFIG | dns.V4MAPPED,
    },
  ).then((result) => givenUrl)
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