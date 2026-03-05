const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getPatientProfile, updatePatientProfile, uploadProfilePic,
  getProfessionalProfile, updateProfessionalProfile, uploadProfessionalPic
} = require('../controllers/profileController');

// Configure Multer for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/patient/:userId', getPatientProfile);
router.put('/patient/:userId', updatePatientProfile);
router.post('/patient/:userId/upload-pic', upload.single('profileImage'), uploadProfilePic);

router.get('/professional/:userId', getProfessionalProfile);
router.put('/professional/:userId', updateProfessionalProfile);
router.post('/professional/:userId/upload-pic', upload.single('profileImage'), uploadProfessionalPic);

module.exports = router;
