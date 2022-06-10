const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

const saltRounds = 12;

//hashing the password via bcrypt before saving it in database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
        this.cpassword = await bcrypt.hash(this.cpassword, saltRounds);
    }
    next();
});


userSchema.methods.generateAuthToken = async function () {
    try {
        //jwt.sign({payload}, secretkey)
        let _token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: _token });
        await this.save();
        return _token;
    }
    catch (err) {
        console.log(err);
    }
} 


const User = mongoose.model('USER', userSchema);

module.exports = User;