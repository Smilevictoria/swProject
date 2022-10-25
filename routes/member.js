var express = require('express');
var router = express.Router();

var MemberModifyMethod = require('../controllers/modify_controller');

MemberModifyMethod = new MemberModifyMethod();
router.post('/register',MemberModifyMethod.postRegister);
router.post('/login',MemberModifyMethod.postLogin);
/* POST home page. 
router.post('/', function(req, res, next) {
  console.log(req.body.test)
  //res.render('index', { title: 'Express' });
});*/

module.exports = router;
