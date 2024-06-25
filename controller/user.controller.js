const  bcrypt= require ("bcryptjs");
const User = require('../models/User');
const jwt = require("jsonwebtoken")

// fonction controller pour récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//  fonction controller pour modifier un user avec id(updateUser)
const getUser =  async (req, res) => {
  try {
    const {id} = req.params;
    const users = await User.findByIdAndUpdate(id, req.body);
    if (!users) {
        return res.status(404).json({message: "user not found"})
    }

    const updateUser = await User.findById(id);
    res.status(200).json(updateUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//  fonction controller pour modifier un user avec id(updateUser)
const updateUser =  async (req, res) =>{
  try {
    const {id} = req.params;
    const users = await User.findByIdAndUpdate(id, req.body);
    if (!users) {
        return res.status(404).json({message: "user not found"})
    }

    const updateUser = await User.findById(id);
    res.status(200).json(updateUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// fonction controller pour créer un nouvel utilisateur
const postUser =  async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// fonction controller pour supprimer un user avec id(deleteUser)
const deleteUser =  async (req, res) =>{
  try {
    const {id} = req.params;
    const deletUser = await User.findByIdAndDelete(id);

    if (!deletUser) {
        return res.status(404).json({message: "user not found"})
    }
    res.status(200).json({message: "User delete successfully"});
} catch (error) {
    res.status(500).json({ message: error.message }); 
}
}

  module.exports = {
    getUsers,
    getUser,
    updateUser,
    postUser,
    deleteUser,
  } ;
  