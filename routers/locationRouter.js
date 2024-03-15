const express = require('express');
const router = express.Router();
const { getLocations, addLocation, getLocation, deleteLocation, updateLocation } = require('../controllers/locationController');
const requireAuth = require('../middleware/requireAuth')

// require auth for all location routes
router.use(requireAuth)

// GET all Locations
router.get('/', getLocations);

// POST a new Location
router.post('/', addLocation);

// GET a single Location
router.get('/:id', getLocation);

// DELETE a Location
router.delete('/:id', deleteLocation);

// Update Location using PUT
router.put('/:id', updateLocation);

module.exports = router;
