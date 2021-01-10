const homecontroller = require('../app/http/controllers/homecontroller');
const authcontroller = require('../app/http/controllers/authcontroller');
const cartcontroller = require('../app/http/controllers/cartcontroller');

function initroute(app) {
    app.get('/',homecontroller().index);
    app.get('/cart',cartcontroller().index)
    app.post('/update-cart',cartcontroller().updatecart)
    app.get('/login',authcontroller().login)
    app.get('/register',authcontroller().register)
}

module.exports = initroute;