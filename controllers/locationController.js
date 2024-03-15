const mongoose = require('mongoose');
const Location = require('../models/locationModel');

// get all Locations
const getLocations = async (req, res) => {
  const user_id = req.user._id

  try {
    const locations = await location.find({user_id}).sort({createdAt: -1})
    res.status(200).json(locations)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Add one Location
const addLocation = async (req, res) => {
  const {name, address, latitude, longitude} = req.body;

  try {
    const user_id = req.user._id;
    const newLocation = new Location({name, address, latitude, longitude, user_id});
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Get Location by ID
const getLocation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such location'});
  }

  try {
    const user_id = req.user._id;
    const location = await Location.findById(id).where('user_id').equals(user_id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Delete Location by ID
const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const location = await Location.findByIdAndDelete({ _id: id, user_id: user_id });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Update Location by ID
const updateLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const Location = await Location.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  getLocations,
  addLocation,
  getLocation,
  deleteLocation,
  updateLocation,
};
