const homecontroller = require('../app/http/controllers/homecontroller');
const authcontroller = require('../app/http/controllers/authcontroller');
const cartcontroller = require('../app/http/controllers/cartcontroller');
const guestmiddleware = require('../app/middleware/guest')

function initroute(app) {
    app.get('/',homecontroller().index);
    app.get('/cart',cartcontroller().index)
    app.post('/update-cart',cartcontroller().updatecart)
    app.get('/login',guestmiddleware,authcontroller().login)
    app.get('/register',guestmiddleware,authcontroller().register)
    app.post('/register',authcontroller().postregister)
    app.post('/login',authcontroller().postlogin)
    app.post('/logout',authcontroller().logout)
}

module.exports = initroute;