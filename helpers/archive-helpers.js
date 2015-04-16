var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var helpers = require('../web/http-helpers.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, data){
    data = data.toString().split('\n');
    callback(data);
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(data) {
    callback(_.contains(data, url));
  });
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list,  url + '\n', function(err){
    if(err){
      console.log('there was an error: ' + err);
    }
  });
};

exports.isURLArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function(err, data) {
    callback(_.contains(data, url));
  });
};

exports.downloadUrls = function(url){
  console.log(url);
  http.get('http://' + url, function(res){
    helpers.getData(res, function(data) {
      fs.writeFile(path.join(exports.paths.archivedSites, url), data);
    });
  });
};
exports.downloadUrls('www.amazon.com');
