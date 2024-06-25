const express = require('express');
const router = express.Router();
const {getHotels,  getHotel, postHotel, updateHotel, deletehotel} = require('../controller/hotel.controller');


// Route pour récupérer tous les  hotels
router.get('/', getHotels)

// Route pour récupérer un seul hotel
router.get('/:id', getHotel);

// Route pour créer un nouvel hotel
router.post('/', postHotel);

// Route pour modifier hotel
router.put('/:id', updateHotel);

// Route pour supprimer  hotel
router.delete('/:id', deletehotel);


module.exports = router;