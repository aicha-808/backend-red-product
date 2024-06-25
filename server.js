require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./config/db');
const authmiddleware = require('./middleware/auth');
const authRoutes = require('./routes/authRoute');
const hotelRoutes = require('./routes/hotelRoute');
const Hotel = require('./models/Hotel');
const fs = require('fs');
const app = express();


connectDB();

// Vérifier et créer le dossier 'uploads' si nécessaire
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration de Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Middleware pour CORS et parsing des requêtes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir), 
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single("imgUrl");

app.use('/', authRoutes);
// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes protégées par JWT
app.use('/api/addHotel', hotelRoutes);

// Route pour ajouter un hôtel
app.post('/api/addHotel', (req, res) => {
  handleMultipartData(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Mettez un fichier image" });
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
});

// Autres routes pour les hôtels
app.get('/api/addHotel', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/addHotel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hotels = await Hotel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!hotels) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/addHotel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletHotel = await Hotel.findByIdAndDelete(id);
    if (!deletHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
