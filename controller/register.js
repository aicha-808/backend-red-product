const express = require('express')
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {

    const { name, email, password } = req.body;
  
    try {
      let user = await User.findOne({email:email}).catch((err) => {
        console.log("Error:",err);
      });
  
      if (user) {
        return res.status(400).json({ message: 'user already exists' });
      }
  
      user = new User({ name, email, password });
  
      // Hachage du mot de passe
      
      user.password = await bcrypt.hash(password, 10);
  
      const savedPassword = await user.save().catch((err) => {
        console.log(err);
        res.status(400).json({err: "User already exists"})
      });
     if (savedPassword) res.status(201).json({message: "user created successfully"});
      
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}) ;

module.exports = router;