const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/pizza",{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:true,useUnifiedTopology:true});
const con = mongoose.connection;
con.once('open',()=>{
    console.log('connection establish');
}).catch((err)=>{
    console.log('some error accure while connecting');
})
