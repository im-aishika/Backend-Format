const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

require('../db/connection');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/register', async (req, res) => {
    
    try {
        const { name, email, phone, work, password, cpassword } = req.body;

        if (!name || !email || !phone || !work || !password || !cpassword) {
            return res.status(422).json({ error: "Please enter all the required fields" });
        }

        const user = await User.findOne({ email: email });

        if (user) {
            return res.status(422).json({ error: "Specified email already exists in the database" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "Password in both fields DO NOT MATCH" });
        }

        const newUser = new User({ name, email, phone, work, password, cpassword });

        //at this juncture we are hashing the password and confirm password in the userSchema script.

        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });

    }
    catch (err) {
        console.log(err);
    }  

});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ error: "Specify your registered email and password" });
        }

        const user = await User.findOne({ email: email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            const token = await user.generateAuthToken();
            //console.log(token);

            res.cookie("myjwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (isMatch) {
                return res.status(201).json({ message: "Successfully logged in" });
            }

            return res.status(400).json({ error: "Incorrect Password. TRY AGAIN" });
        }
        else {
            return res.status(400).json({ error: "Specified email does not exist in database. Register First" });
        }
    }
    catch (err) {
        res.status(400).json({ error: err });
    }

});


module.exports = router;

