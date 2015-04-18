var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
var Q = require('q');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  if (asset === '/index.html') {
    exports.renderTemplate(res);
  } else {
    fs.readFile(path.join(archive.paths.siteAssets, asset), function(err, data){
      if(err) {
        fs.readFile(path.join(archive.paths.archivedSites, asset), function(err, data) {
          if(err) {
            headers['Content-Type'] = 'text/html';
            exports.sendResponse(res, '<center><img src="http://i.imgur.com/VNadMYt.jpg"></center>', 404);
          } else {
            exports.sendResponse(res, data);
          }
        });
      } else {
        if (asset.slice(-3) === 'css') {
          headers['Content-Type'] = 'text/css';
        } else {
          headers['Content-Type'] = 'text/html';
        }
        exports.sendResponse(res, data);
      }
    });
  }
};

exports.sendResponse = function(res, asset, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(asset);
  return res;
};

exports.getData = function(req, callback) {
  var data = '';

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    callback(data);
  });
};

exports.getDataPromise = function(req) {
  var deferred = Q.defer();
  var data = '';

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    deferred.resolve(data);
  });
  return deferred.promise;
};


exports.redirect = function(res, destination) {
  res.writeHead(302, {location: destination});
  res.end();
};

exports.renderTemplate = function(res) {
  var templateContent = {};

  archive.readListOfUrls(function(urlsArray) {
    templateContent.urls = Array.prototype.slice.call(urlsArray);
    fs.readFile(path.join(archive.paths.siteAssets, '/index.html'), function(err ,data) {
      var tpl = _.template(data.toString());
      var templatedHTML = tpl(templateContent);
      exports.sendResponse(res, templatedHTML);
    });
  });
};

// As you progress, keep thinking about what helper functions you can put here!
