const express = require('express');
const router = express.Router();
const common_controller = require('../controller/common_Controller')
const auth=require('../auth/authentication')

router.get('/',auth.aut,common_controller.login);
router.post('/register',common_controller.adminRegister_save);
router.post('/login',common_controller.adminLogin);
router.get('/subAdmin',auth.aut,common_controller.subadmin_page);
router.get('/newuser',auth.aut,common_controller.user_page);
router.post('/subadmin',auth.aut,common_controller.subadmin_save);
router.post('/user',auth.aut,common_controller.user_save);
router.get('/viewsubAdmin',auth.aut,common_controller.viewsubadmin);
router.get('/viewuser',auth.aut,common_controller.viewuser);
router.get('/delete/:id',auth.aut,auth.checkauth,common_controller.deletedata);
router.get('/modify/:id',auth.aut,auth.checkauth,common_controller.modify);
router.post('/modify_save',auth.aut,common_controller.modify_save);
router.get('/forgotpage',common_controller.forgotpage);
router.post('/forgot',common_controller.forgot,common_controller.forgotpass);

module.exports = router;