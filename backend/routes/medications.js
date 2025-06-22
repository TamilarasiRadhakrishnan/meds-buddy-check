const express = require('express');
const router = express.Router();
const {
  addMedication,
  getMedications,
  markAsTaken
} = require('../controllers/medicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', addMedication);
router.get('/', getMedications);
router.post('/:medicationId/taken', markAsTaken);

module.exports = router;
