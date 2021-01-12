const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    customerid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    items:{
        type:Object,
        required:true  
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    paymenttype:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'order_placed'
    }
},{timestamps:true})
const order = mongoose.model('order',orderSchema);
module.exports = order;