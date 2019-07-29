import mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

mongoose.model('User', userSchema);
