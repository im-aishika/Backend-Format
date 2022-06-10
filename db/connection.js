const mongoose = require('mongoose');

const userDB = process.env.DATABASE;

mongoose.connect(userDB)
    .then(() => {
        console.log("connected to database succesully")
    })
    .catch((err) => {
        console.log('connection failed');
    });
