const Ordermodel = require('../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function ordercontroller(){
    return{
        store (req,res){
            console.log(req.body);
            const { paymentType,phone,address,stripetoken} = req.body;
            if(!phone || !paymentType || !address){
                return res.status(422).json({error:"All field required"})
            }
            const neworder = new Ordermodel({
                customerid : req.user._id,
                items : req.session.cart.items,
                phone : phone,
                address : address,
                paymenttype : paymentType
            })
            neworder.save()
            .then(result => {
                Ordermodel.populate(result,{path:'customerid'},(err,placedorder)=>{
                    //// stripe payment
                    if(paymentType === 'card'){
                        stripe.charges.create({
                            amount:req.session.cart.totalprice * 100,
                            source:stripetoken,
                            currency:'inr',
                            description:`pizza order id: ${placedorder._id}`
                        }).then(()=>{
                            placedorder.paymentStatus = true;
                            placedorder.save().then((ord)=>{
                                    console.log(ord);
                                    /// order place emit
                                   const eventEmiter = req.app.get('eventEmiter');
                                    eventEmiter.emit('orderplaced',ord);
                                     delete req.session.cart;                    
                                     res.status(200).json({success:'Order place Payment recived successfully!!',status:true})
                            }).catch((err)=>{
                                console.log(err);
                               return res.status(400).json({error:"suspicious payment",Err:err,status:false})
                            })
                        }).catch((Err)=>{
                            console.log(Err);
                            delete req.session.cart;                    
                            return res.status(400).json({error:"payment Failed u can pay at delivery time",Err:Err,status:false})
                        })
                    }
                    // return res.status(200).json({success:'Order place successfully!!'})
         
                })
            }).catch(err => {
                return res.status(500).json({error:"something went wrong",status:false})
            })
        },
        async myorders(req,res){
            const orders = await Ordermodel.find({customerid:req.user._id},null,{sort:{'createdAt':-1}});
            res.render('customer/myorders',{orders,moment});
        },
        async singleorder(req,res){
            const order = await Ordermodel.findById(req.params.id);
            //// authrized user
            if(req.user._id.toString() === order.customerid.toString()){
                res.render('customer/singleorder',{order});
            }else{
                return res.redirect('/');
            }
        }
    }
}

module.exports = ordercontroller;