const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('node:crypto');
const { createToken } = require("../service/auth");

const userScheme = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        enum: ['admin', 'user', 'manager'],
        type: String,
        default: 'user'
    }
});

userScheme.pre('save', async function(next) {
    const user = this;
    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
    user.password = hashPassword;
    user.salt = salt;
    next();
});

userScheme.static('matchPassword', async function(email, password) {
    const user = await this.findOne({ email: email});
    if (!user) throw new Error('No such user');
    const hashPassword = user.password;
    
    const userProvidedHash= createHmac('sha256', user.salt)
    .update(password)
    .digest('hex');
    if (hashPassword !== userProvidedHash) {
        throw new Error('Invalid password');
    }
    const token = createToken(user)
    return token;
});

const User = model("user", userScheme);

module.exports = User;

  