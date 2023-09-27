const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex');

    const User = new User({
      firstName,
      lastName,
      email,
      password: hash, 
      salt,
    });

    await User.save();
    res.status(201).json({ message: 'Signup successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
    try {
      const key="SECRET"
      const { email, password } = req.body;
      const User = await User.findOne({ email });
  
      if (!User) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const hash = crypto
        .createHmac('sha256', User.salt)
        .update(password)
        .digest('hex');
  
      if (hash === User.password) {
        const token = jwt.sign(
          { UserId: User._id, email: User.email },
          key, 
          { expiresIn: '1h' } 
        );
  
        res.status(200).json({ message: 'Login successful', userInfo:{email:User.email,name:User.firstName,id:User._id }});
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports=router;