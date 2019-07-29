import mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        min: 0.01
    }
});

mongoose.model('Product', productSchema);
