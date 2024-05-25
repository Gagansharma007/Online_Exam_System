const { register , login , setAvatar, getAllUsers , uploadAvatar } = require('../controllers/userController');

const router = require('express').Router();
router.post('/register',register);
router.post('/login',login);
router.post('/setAvatar/:id', uploadAvatar ,setAvatar);
// router.get('/allusers/:id',getAllUsers);
module.exports = router;