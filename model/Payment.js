const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    amount: Number,
    paymentMode: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    txtRef: String,
    date: {
        type: Date,
        default: Date.now,
    },

});