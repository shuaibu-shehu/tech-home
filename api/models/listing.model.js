const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }, 
    offer: {
        type: Boolean,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrls: {
        type: Array,
        required: true,
    },
    userRef: {
        type: String, 
        required: true,
    },
    }, { timestamps: true });


module.exports = mongoose.model("Listing", listingSchema);