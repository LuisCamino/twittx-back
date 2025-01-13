const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const check = require("../middlewares/auth") 

router.get('/prueba-user', check.auth , userController.pruebaUser)
router.post('/register', userController.registerUser);
router.post('/login', userController.login)
router.get('/profile/:id',check.auth, userController.profile)
router.get('/list/:page?', check.auth, userController.listUsers)


module.exports = router;