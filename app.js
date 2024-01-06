const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser')
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkforAuthCookie } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
    .connect("mongodb://127.0.0.1:27017/blogify")
    .then(() => console.log("mongoose connected"))
    .catch(err => console.log('error connecting to', err));

app.use(express.urlencoded({ extended: false }));


app.use(cookiePaser());
app.use(checkforAuthCookie('token'))

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.get('/', (req, res) => {
    res.render('home', {    
        user: req.user,
      });
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log('listening on port'));