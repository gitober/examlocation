const mongoose = require('mongoose');
const Location = require('../models/locationModel');

// Get all Locations
const getLocations = async (req, res) => {
  const user_id = req.user._id;

  try {
    const locations = await Location.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add one Location
const addLocation = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  try {
    const user_id = req.user._id;
    const newLocation = new Location({ name, address, latitude, longitude, user_id });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedLocation = await Location.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};


module.exports = {
  getLocations,
  addLocation,
  getLocation,
  deleteLocation,
  updateLocation,
};
