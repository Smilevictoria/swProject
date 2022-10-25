var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();

console.log('enroll test!');

  //connect with mongodb
  MongoClient.connect("mongodb://localhost:27017/signData", function(err,db){
    if(err){
      console.log("連線失敗");   //debug(跟mongodb的連線失敗)
      throw err;  
    }
    console.log("連線成功");     //debug(跟mongodb的連線成功)
  })