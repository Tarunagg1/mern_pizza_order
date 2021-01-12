const Ordermodel = require('../../../models/order')

function ordercontroller(params) {
    return{
        index(req,res){
            Ordermodel.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}})
            .populate('customerid','-password').exec((err,orders)=>{
                
                res.render('admin/orders')
            });

        },
        fetchindex(req,res){
            Ordermodel.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}})
            .populate('customerid','-password').exec((err,orders)=>{
                    return res.status(200).json(orders);
            });
        },
        status(req,res){
            Ordermodel.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
                if(err){
                    return res.redirect('/admin/orders');
                }
                /// emit event
                const eventEmiter = req.app.get('eventEmiter');
                eventEmiter.emit('orderupdated',{id:req.body.orderId,status:req.body.status})
                return res.redirect('/admin/orders');
            })
        }
    }
}
module.exports = ordercontroller;