const homecontroller = require('../app/http/controllers/homecontroller');
const authcontroller = require('../app/http/controllers/authcontroller');
const cartcontroller = require('../app/http/controllers/cartcontroller');
const guestmiddleware = require('../app/middleware/guest');
const ordercontroller = require('../app/http/controllers/ordercontroler')
const auth = require('../app/middleware/auth')
const admincontroller = require('../app/http/controllers/admin/admincontroller')
const adminauth = require('../app/middleware/adminauth')

function initroute(app) {
    app.get('/',homecontroller().index);
    app.get('/cart',cartcontroller().index)
    app.post('/update-cart',cartcontroller().updatecart)
    app.get('/login',guestmiddleware,authcontroller().login)
    app.get('/register',guestmiddleware,authcontroller().register)
    app.post('/register',authcontroller().postregister)
    app.post('/login',authcontroller().postlogin)
    app.post('/logout',authcontroller().logout)
    app.post('/orders',auth,ordercontroller().store)
    app.get('/customer/orders/:id',auth,ordercontroller().singleorder)
    app.get('/customer/myorders',auth,ordercontroller().myorders)

    ///// admin
    app.get('/admin/orders',adminauth,admincontroller().index)
    app.get('/admin/ferchorders',adminauth,admincontroller().fetchindex)
    app.post('/admin/order/status',adminauth,admincontroller().status);
}

module.exports = initroute;