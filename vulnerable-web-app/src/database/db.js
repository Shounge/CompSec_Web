const mongoose = require('mongoose');
const config = require('./config');

// Connect to the database
mongoose.connect(config.dbUrl, config.options)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// User model
const User = mongoose.model('User', userSchema);

// Function to add a new user
const addUser = async (username, password) => {
    const user = new User({ username, password });
    return await user.save();
};

// Function to find a user by username
const findUserByUsername = async (username) => {
    return await User.findOne({ username });
};

// Function to find user by username and password
const findUser = async (username, password) => {
    return await User.findOne({ username, password });
};

// Function to get all users
const getAllUsers = async () => {
    return await User.find({});
};

// Function to get user by ID
const getUserById = async (id) => {
    return await User.findById(id);
};

// Function to update user
const updateUser = async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true });
};

// Exporting functions
module.exports = {
    addUser,
    findUserByUsername,
    findUser,
    getAllUsers,
    getUserById,
    updateUser
};