const { Router } = require('express');
const user = require('../models/user');

const routers = Router();

routers.get('/sign-in', (req, res) => {
    return res.render('signin');
});

routers.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    try { 
        const token = await user.matchPassword(email, password);
        res.cookie('token', token).redirect('/');

    } catch (err) { 
        return res.render("signin", {
            error: "Incorrect Email or Password",
          });
    }
});

routers.get('/sign-up', (req, res) => {
    return res.render('signup');
});

routers.post('/sign-up', async (req, res) => {
    const { fullName, password, email } = req.body;
    try {
        await user.create({fullName, password, email});

    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
          });
    }
    res.redirect('/');
});

module.exports = routers;