import mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user : {
        type: String,
        required: true
    },
    products: {
        type: [String],
        required: true
    },
    numbers: {
        type: [String],
        required: true
    }
});

mongoose.model('Order', orderSchema);
