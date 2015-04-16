var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

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
  console.log(asset);
  fs.readFile(path.join(archive.paths.siteAssets, asset), function(err, data){
    if(err) {
      fs.readFile(path.join(archive.paths.archivedSites, asset), function(err, data) {
        if(err) {
          exports.sendResponse(res, '<h1>Not Found</h1>', 404);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
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


exports.redirect = function(res, destination) {
  res.writeHead(302, {location: destination});
  res.end();
};

// As you progress, keep thinking about what helper functions you can put here!
