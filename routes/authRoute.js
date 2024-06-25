const express = require('express');
const router = express.Router();
const {getUsers, getUser, updateUser, postUser,deleteUser} = require('../controller/user.controller');
const registerUser = require('../controller/register');
const loginUser = require('../controller/login');
const rejetPassword = require('../controller/service.rejetpw');

// Route pour récupérer tous les user 
router.get('/', getUsers);

// Route pour récupérer un seul user 
router.get('/:id', getUser);

// Route pour créer un nouvel user et hotel
router.post('/', postUser);

// Route pour modifier un user avec id(updateUser) et hotel
router.put('/:id', updateUser);

// Route pour supprimer un user avec id(deleteUser) et hotel
router.delete('/:id', deleteUser);

router.use(registerUser);
router.use(loginUser);
router.use(rejetPassword);

router.get('/', (req, res) => {
    res.json({
      message: 'API'
    });
  });
  

module.exports = router;