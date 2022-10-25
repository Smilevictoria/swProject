var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
//const db = require('./connectDB');

module.exports = function memberLogin(memberData){

    let result = {};
    return new Promise((resolve, reject) =>{
        MongoClient.connect("mongodb://localhost:27017/signData", function(err,db){
            if(err){
                console.log(err);
                result.status = "連線失敗"
                result.err = "伺服器錯誤!"
                reject(result);
                return;
            }

            var dbo = db.db('signData');
            
            dbo.collection('userList').findOne(memberData, function(err, res){
            if(err){
                console.log(err);
                result.status = "連線失敗"
                result.err = "伺服器錯誤!"
                reject(result);
                return;
            }else{
                if(res==null){
                    reject(result);
                }
                else{
                    result.loginMember = memberData;
                    resolve(result);
                }
                
            }
            })
        })
    })
}