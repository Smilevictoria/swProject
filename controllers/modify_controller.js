const toRegister = require('../models/register_model');
const loginAction = require('../models/login_model');

module.exports = class member{

    postRegister(req, res, next){
    
        var memberData = {
            account: req.body.account,
            password: req.body.password,
            email: req.body.email
        };
        
        toRegister(memberData).then(result =>{

            res.json({
                status: "註冊成功",
                result: result
            })
        },(err) => {
            res.json({
                result: err
            })
        })
    }
    postLogin(req, res, next){
    
        var memberData = {
            account: req.body.account,
            password: req.body.password
        };

        loginAction(memberData).then(result => {
            res.json({
                status: "登入成功",
                result: result
            })
        },(err) => {
            res.json({
                status: "登入失敗",
                result: err
            })
        })
    }

}