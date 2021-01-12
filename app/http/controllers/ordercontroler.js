const Ordermodel = require('../../models/order')
const moment = require('moment')
function ordercontroller(){
    return{
        store (req,res){
            const { paymentType,phone,address} = req.body;
            if(!phone || !paymentType || !address){
                req.flash('error','All field required');
                return res.redirect('/cart');
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
                    req.flash('success','Order place successfully!!');
                    delete req.session.cart;
                    /// order place emit
                    const eventEmiter = req.app.get('eventEmiter');
                    eventEmiter.emit('orderplaced',result);
                    return res.redirect('/customer/myorders');
                })
            }).catch(err => {
                req.flash('error','something went wrong');
                return res.redirect('/cart');
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