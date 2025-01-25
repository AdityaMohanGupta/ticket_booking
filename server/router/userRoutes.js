const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userfound = await User.findOne({ email })
        if (userfound) {
            return res.status(422).render('signup', { error: "Email already exists", name, email });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const userData = await new User({ name, email, password:hashedPassword });
        await userData.save();
        res.redirect('/login');
    }
    catch (e) {
        console.log(e);
        res.status(500).render('signup', { error: "An error occurred during signup." });
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userfound = await User.findOne({ email });
        const hashedPassword = userfound.password;
        const isMatched = await bcrypt.compare(password, hashedPassword);
        if (isMatched) {
            const token = jwt.sign({ _id: userfound._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
            res.cookie('token', token, { httpOnly: true, secure: false }); // Ensure the cookie is set
            return res.redirect('/');
        }
        else {
            return res.status(400).render('login', { error: "Invalid email or password", email });
        }
    }
    catch (e) {
        console.log(e)
        return res.status(500).render('login', { error: "Something went wrong, please try again later." });

    }
})


module.exports = router;