var setting = require("../setting");
var Db = require("mongodb").Db;
var Connection = require('mongodb').onnection;
var Server =  require('mongodb').Server;
module.exports = new Db(setting.db, new Server(setting.host,27017, {safe:true}));