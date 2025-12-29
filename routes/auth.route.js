const express = require('express');
const router = express.Router();
const { register, login, logout, currentUser } = require('../controllers/auth.controller');
const upload = require('../utils/multer')
const { registerValidation, loginValidation } = require('../middelwares/validations/authValidations');
const validate = require('../middelwares/validations/Validator');
const isAuth = require('../middelwares/isAuth');
const hashRole = require('../middelwares/hashRole');
//register (public)
router.post('/register', 
    upload.single('profilePic'), registerValidation, validate, 
    register);

    //login
    router.post('/login',loginValidation, validate, login);
    //logout
    router.post('/logout', isAuth, logout);
    //current
    router.get('/current', isAuth, currentUser)
module.exports = router;