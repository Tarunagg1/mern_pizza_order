const menuschema = require('../../models/menu');

function homecontroller(){
    return{
        async index (req,res){
            try {
                const pizza = await menuschema.find();
                res.render('home',{pizza})
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = homecontroller;