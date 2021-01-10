require('dotenv').config();
const express = require('express');
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose')
const db = require('./app/config/db');
const session = require('express-session') 
const flash = require('express-flash');
const mongodbstore = require('connect-mongo')(session);
const app = express();


const con = mongoose.connection;

//// session store
const mongosestore = new mongodbstore({
    mongooseConnection:con,
    collection:'sessions'
})

//// session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongosestore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}
    // cookie:{maxAge:1000*15}
}))

app.use(flash());

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use((req,res,next)=>{
    res.locals.session = req.session
    next()
});

/// set template engin
app.use(expresslayout);
app.use(express.static('public'))
app.set('views',path.join(__dirname,'/resourses/views'));
app.set('view engine','ejs');

require('./routes/web')(app)

app.listen(PORT,()=>{
    console.log('App listining at ',PORT);
})


