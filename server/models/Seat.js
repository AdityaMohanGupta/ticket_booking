const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatName: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'booked'],
        default: 'available'
    }
});


const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
