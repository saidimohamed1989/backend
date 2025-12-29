const express = require('express');
const router = express.Router();
const { listUsers, getUser, updateUser, deleteUser } = require('../controllers/users.controller');
const upload = require('../utils/multer');
const isAuth = require('../middelwares/isAuth');
const hashRole = require('../middelwares/hashRole');

// Only ADMIN can manage users
router.get('/', isAuth, hashRole('ADMIN'), listUsers);
router.get('/:id', isAuth, hashRole('ADMIN'), getUser);
// allow admin to update user with optional profilePic upload
router.put('/:id', isAuth, hashRole('ADMIN'), upload.single('profilePic'), updateUser);
router.delete('/:id', isAuth, hashRole('ADMIN'), deleteUser);

module.exports = router;
