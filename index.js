require('dotenv').config();
const express = require('express');
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;


/// set template engin
// app.use(expresslayout);
app.set('views',path.join(__dirname,'/resourses/views'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(PORT,()=>{
    console.log('App listining at ',PORT);
})


