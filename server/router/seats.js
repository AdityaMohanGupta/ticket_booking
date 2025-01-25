const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');

router.get('/movies/seat/check', async (req, res) => {
    try {
        const results = await Seat.find({ status: 'booked' });
        res.json(results);
        // res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching booked seats.', details: err.message });
    }
});
let a=null;
router.post('/movies/seat/booked', async (req, res) => {
    const { seatName } = req.body; 

    console.log(req.body); 

    if (!seatName) {
        return res.status(400).json({ success: false, message: 'Seat name is required.' });
    }

    const seat = new Seat({
        seatName,
        status: 'booked'
    });

    try {
        await seat.save();
        a=seat.seatName;
        console.log('Data inserted successfully');
        console.log(a);
        res.json({ success: true, message: 'Seat booked successfully.' });
        // res.render('movie', { seatName: seat.seatName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});

router.get('/movies/seat/booked', async (req, res) => {
    try {
        const seat = await Seat.findOne({ seatName: a });

        if (!seat) {
            return res.status(404).json({ success: false, message: 'No booked seats found.' });
        }

        res.json({ success: true, seatName: seat.seatName });
    } catch (err) {
        console.error('Error fetching booked seat:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});



// Delete booked seat record based on seat name
router.post('/movies/seat/delete', async (req, res) => {
    const { seatName } = req.body;
    if (!seatName) {
        return res.status(400).json({ success: false, message: 'Seat name is required for deletion.' });
    }
    try {
        const result = await Seat.findOneAndDelete({ seatName });
        if (!result) {
            return res.status(404).json({ success: false, message: 'Seat not found or already deleted.' });
        }
        console.log('Seat deleted successfully:', seatName);
        res.json({ success: true, message: 'Seat deleted successfully.' });
    } catch (err) {
        console.error('Error deleting seat:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});


module.exports = router;