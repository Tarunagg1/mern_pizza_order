require('dotenv').config();
const express = require('express');
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose')
const db = require('./app/config/db');
const session = require('express-session') 
const flash = require('express-flash');
const passport = require('passport');
const mongodbstore = require('connect-mongo')(session);
const Emitter = require('events')
const app = express();


const con = mongoose.connection;



//// session store
const mongosestore = new mongodbstore({
    mongooseConnection:con,
    collection:'sessions'
})


//// event emiter
const eventEmiter = new Emitter();
app.set('eventEmiter',eventEmiter);

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

///// passport config
const passportinit = require('./app/config/passport');
passportinit(passport);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
});

/// set template engin
app.use(expresslayout);
app.use(express.static('public'))
app.set('views',path.join(__dirname,'/resourses/views'));
app.set('view engine','ejs');

require('./routes/web')(app)

const server = app.listen(PORT,()=>{
    console.log('App listining at ',PORT);
})


//// socket
const io = require('socket.io')(server)
io.on('connection',(socket)=>{
    // join
    console.log(socket.id);
    socket.on('join',(orderid)=>{
        socket.join(orderid)
    })
})
eventEmiter.on('orderupdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderupdated',  data);
})
eventEmiter.on('orderplaced',(data)=>{
    io.to(`adminroom`).emit('orderplaced',  data);
})