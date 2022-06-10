require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// dotenv.config({ path: './config.env' });
const PORT = process.env.PORT;

require('./db/connection');


//linking the router files
app.use(require('./router/auth'));

//Middleware
const middleware = (req, res, next) => {
    console.log('Hello from the middleware');
    next();
}

app.get('/about', middleware, (req, res) => {
    res.send('Hello from about after middleware');
});


app.listen(PORT, () => {
    console.log('Server is listening to PORT 3000');
});
