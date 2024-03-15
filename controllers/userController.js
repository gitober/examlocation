const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role
    });

    // Save user to database
    await user.save();

    // Create a token
    const token = createToken(user._id);

    // Respond with status code 201 (Created) and user's email and token
    res.status(201).json({ email: user.email, token });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };