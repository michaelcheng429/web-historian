var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var urlParser = require('url');
// require more modules/folders here!

var actions = {
  GET: function(req, res) {
    var parts = urlParser.parse(req.url);
    var pathname;
    if(parts.pathname === '/') {
      //serve index
      pathname = '/index.html';
    } else {
      //serve file
      pathname = parts.pathname;
    }
    helpers.serveAssets(res, pathname, function() {
      //
    });
  },
  POST: function(req, res) {
    helpers.getData(req, function(data) {
      data = data.slice(4);
      archive.isUrlInList(data, function(inList){
        if(!inList) {
          archive.addUrlToList(data);
          helpers.redirect(res, '/loading.html');
        } else {
          archive.isURLArchived(data, function(inArchives){
            if (!inArchives) {
              helpers.redirect(res, '/loading.html');
            } else {
              helpers.serveAssets(res, data);
            }
          });
        }
      });
    });


  }
};
exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if(action) {
    action(req, res);
  }
  //res.end(archive.paths.list);
};
