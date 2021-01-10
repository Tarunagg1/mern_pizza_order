function cartcontroller(){
    return{
        index(req,res){
            res.render('customer/cart')
        },
        updatecart(req,res){
            if(!req.session.cart){
                req.session.cart = {
                    items:{},
                    totalQty:0,
                    totalprice:0
                }
            }else{
                let cart = req.session.cart;
                if(!cart.items[req.body._id]){
                    cart.items[req.body._id]={
                        item:req.body,
                        qty:1
                    }
                    cart.totalQty = cart.totalQty+1
                    cart.totalprice = cart.totalprice + req.body.price
                }else{
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                    cart.totalQty = cart.totalQty+1
                    cart.totalprice = cart.totalprice + req.body.price
                }
            }   
            return res.status(200).json({totalqty:req.session.cart.totalQty})
        }
    }   
}
module.exports = cartcontroller;