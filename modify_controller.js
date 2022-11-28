const insertNewData = require('../models/insertData_model');
const inputDataByAcc = require('../models/updateData_model');
const matchOwner = require('../models/matchOwner');
const notify = require('../models/notify_model');
var MongoClient = require('mongodb').MongoClient;
var connectAddr = "mongodb+srv://victoria:cody97028@cluster17.mrmgdrw.mongodb.net/mydb?retryWrites=true&w=majority";

var fs = require("fs");

/*  global variables, for using the information conviniently.   
    password cannot be recorded in global variables for security. */
var LOCAL_IDENTITY = {  
    account     : null,                                     //帳號
    name        : null,                                     //姓名
    phone       : null,                                     //電話
    email       : null,                                     //email
    gender      : "secret",                                 //性別 (male / female)
    license     : null,                                     //車牌號碼
    helmet      : "no",                                     //是否有安全帽 (yes / no)
    location    : null,                                    //可接送地點 <Array>
    workingTime : null,                                     //可載客時間 <Array>
    other       : "No other condition or comment.",         //其他說明
    status      : "offline",                                //上線狀態 (online / busy / offline)
    identity    : "unknown"                                 //身分 (owner / passenger)
};


/*  To avoid the data not changed to cover old data.  
    Must be called before call inputDataByAcc !!      */
function updateLocalVar(identityData) { 
    LOCAL_IDENTITY.account     = (identityData.account)     ? identityData.account : LOCAL_IDENTITY.account;    
    LOCAL_IDENTITY.name        = (identityData.name)        ? identityData.name : LOCAL_IDENTITY.name;    
    LOCAL_IDENTITY.phone       = (identityData.phone)       ? identityData.phone : LOCAL_IDENTITY.phone;  
    LOCAL_IDENTITY.email       = (identityData.email)       ? identityData.email : LOCAL_IDENTITY.email;  
    LOCAL_IDENTITY.gender      = (identityData.gender)      ? identityData.gender : LOCAL_IDENTITY.gender;   
    LOCAL_IDENTITY.license     = (identityData.licensePlateNum)     ? identityData.licensePlateNum : LOCAL_IDENTITY.license;
    LOCAL_IDENTITY.helmet      = (identityData.helmet)      ? identityData.helmet : LOCAL_IDENTITY.helmet;
    LOCAL_IDENTITY.location    = (identityData.location)    ? identityData.location : LOCAL_IDENTITY.location;
    LOCAL_IDENTITY.workingTime = (identityData.workingTime) ? identityData.workingTime : LOCAL_IDENTITY.workingTime;
    LOCAL_IDENTITY.other       = (identityData.other)       ? identityData.other : LOCAL_IDENTITY.other;
    LOCAL_IDENTITY.status      = (identityData.status)      ? identityData.status : LOCAL_IDENTITY.status;
    LOCAL_IDENTITY.identity    = (identityData.identity)    ? identityData.identity : LOCAL_IDENTITY.identity;;
};

module.exports = class member{

    postRegister(req, res, next){

        LOCAL_IDENTITY.account = req.body.account;
        var registerData = {
            account: req.body.account,
            password: req.body.password,
            email: req.body.email
        };

        if(req.url === '/register') {
            const htmlFile = 'C:/SW-project/public/chooseIdentity_main.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(htmlFile).pipe(res);

            MongoClient.connect(connectAddr, function(err,db){
                if(err){
                    console.log(err);
                    result.status = "連線失敗"
                    result.err = "伺服器錯誤!"
                    throw err;
                }
    
                var dbo = db.db('mydb');
    
                dbo.collection('test').insertOne(registerData, function(err, res){
    
                    if(err){
                        console.log(err);
                        result.status = "連線失敗"
                        result.err = "伺服器錯誤!"
                        reject(result);
                        return;
                    }
                    updateLocalVar(registerData);
                })
            })
      
        }
        
        
    }

    postLogin(req, res, next){
    
        var signInData = {
            account: req.body.account,
            password: req.body.password
        };

        MongoClient.connect(connectAddr, function(err,db){
            if(err){
                console.log("資料庫連線失敗");
                result.status = "連線失敗"
                result.err = "伺服器錯誤!"
                reject(result);
                return;
            }

            var dbo = db.db('mydb');

            console.log("[succ] connect to mongodb." );

            dbo.collection('test').find(signInData).toArray((err, res) => {
                if(err){
                    console.log("[err] fail to connect collection." );
                    console.log(err);
                    result.status = "連線失敗";
                    result.err = "伺服器錯誤!";
                    throw err;
                }else{
                    console.log("[succ] succ to connect collection." );
                    if(res == null){
                        console.log("[err] fail to login (no found data)." );
                    }
                    else{
                        console.log("[succ] succ to login." );
                        updateLocalVar(res);
                    }            
                }
            });
        })

        const htmlFile = 'C:/SW-project/public/chooseIdentity.html';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(htmlFile).pipe(res);
        
        var loginData = {
            account:    signInData.account,
            status:     "online"
        }
        updateLocalVar(loginData);
        
    }

    postMatchOwner(req, res, next){
    
        LOCAL_IDENTITY.account = req.body.account;
        var matchData = {
            identity: req.body.identity,
            status: req.body.status,
            location: req.body.location
        };
        
        matchOwner(matchData).then(result =>{
            res.json({
                status: "match 成功",
                result: result
            })
        },(err) => {
            res.json({
                result: err
            })
        })
    }

    postChangeInfo(req, res, next){

        var changeData = {
            account:            LOCAL_IDENTITY.account,     //帳號
            name:               req.body.name,              //姓名
            phone:              req.body.phone,             //電話
            email:              req.body.email,             //email
            gender:             req.body.gender,            //性別
            licensePlateNum:    req.body.licensePlateNum,   //車牌號碼
            location:           req.body.location,          //可接送地點
            workingTime:        req.body.workingTime,       //可載客時間
            helmet:             req.body.helmet,            //是否有安全帽
            other:              req.body.other,             //其他說明
            status:             req.body.status,            //上線狀態
            identity:           req.body.identity
        };

        updateLocalVar(changeData);

        if(req.url === '/passengerInfo') {
            const htmlFile = 'C:/SW-project/public/SignIn.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(htmlFile).pipe(res);
      
        }
        else if(req.url === '/ownerInfo') {
            const htmlFile = 'C:/SW-project/public/SignIn.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(htmlFile).pipe(res);
      
        }
        else if(req.url === '/changeOwnerBasic') {
            const htmlFile = 'C:/SW-project/public/mainPage.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(htmlFile).pipe(res);
      
        }
        else if(req.url === '/changeOwnerTime') {
            const htmlFile = 'C:/SW-project/public/mainPage.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(htmlFile).pipe(res);
      
        }
        else if(req.url === '/changeOwnerLoc') {
            const htmlFile = 'C:/SW-project/public/mainPage.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(htmlFile).pipe(res);
      
        }
        else if(req.url === '/identityInfo') {
            const htmlFile = 'C:/SW-project/public/ownerInfo.html';
            const htmlFile2 = 'C:/SW-project/public/passagerInfo.html';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            if(req.body.identity=='owner'){
                fs.createReadStream(htmlFile).pipe(res);
              }
               else{
                fs.createReadStream(htmlFile2).pipe(res);
               }
      
        }

        
        MongoClient.connect(connectAddr, function(err,db){
            if(err){
                console.log("資料庫連線失敗");
                result.status = "連線失敗"
                result.err = "伺服器錯誤!"
                throw err;
            }

            var dbo = db.db('mydb');
            
            dbo.collection('test').updateOne({account:LOCAL_IDENTITY.account}, {$set:LOCAL_IDENTITY}, {upsert:true});
        })
    }

    postNotify(req, res, next){

    }
}
