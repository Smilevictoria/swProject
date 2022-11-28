var express = require('express');
var router = express.Router();

var MemberModifyMethod = require('../controllers/modify_controller');

MemberModifyMethod = new MemberModifyMethod();
router.post('/register', MemberModifyMethod.postRegister);
router.post('/login', MemberModifyMethod.postLogin);
router.post('/passengerInfo', MemberModifyMethod.postChangeInfo);
router.post('/ownerInfo', MemberModifyMethod.postChangeInfo);
router.post('/changeOwnerBasic', MemberModifyMethod.postChangeInfo);
router.post('/changeOwnerTime', MemberModifyMethod.postChangeInfo);
router.post('/changeOwnerLoc', MemberModifyMethod.postChangeInfo);
router.post('/identityInfo', MemberModifyMethod.postChangeInfo);


module.exports = router;
