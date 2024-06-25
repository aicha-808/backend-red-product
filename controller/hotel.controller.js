const Hotel = require('../models/Hotel');
const path = require("path");
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"), 
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single("imgUrl");


const getHotels = async (req, res) => {
    try {
      const hotels = await Hotel.find({});
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
const getHotel = async (req, res)  => {
    try {
        const {imgUrl, adresse, titre, prix} = req.body;
        const newHotel = new Hotel({imgUrl, adresse, titre, prix});
        await newHotel.save();
        res.status(201).json(newHotel);
    } catch (error) {
        res.status(500).json({message: error.message });
    }
} 

const postHotel = async (req, res)  => {
  handleMultipartData(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const filePath = req.file.path;
    cloudinary.uploader.upload(filePath, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      
      const { adresse, titre, prix } = req.body;
      
      try {
        const newHotel = await Hotel.create({
          imgUrl: result.secure_url,
          adresse,
          titre,
          prix
        });
        res.status(201).json(newHotel);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  });
}
const updateHotel =  async (req, res) =>{
  try {
    const {id} = req.params;
    const hotels = await Hotel.findByIdAndUpdate(id, req.body,{new: true, runValidators: true}) ;
    if (!hotels) {
        return res.status(404).json({message: "hotel not found"})
    }

    const updateHotel = await Hotel.findById(id);
    res.status(200).json(updateHotel);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  }
  const deletehotel =  async (req, res) =>{
      try {
        const {id} = req.params;
        const deletHotel = await Hotel.findByIdAndDelete(id);
    
        if (!deletHotel) {
            return res.status(404).json({message: "hotel not found"})
        }
        res.status(200).json({message: "hotel delete successfully"});
      } catch (error) {
        res.status(500).json({ message: error.message }); 
      }
  }

module.exports = {
    getHotels,
    getHotel,
    postHotel,
    updateHotel,
    deletehotel
}