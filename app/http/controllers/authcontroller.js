const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authcontroller(){
    return{
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')    
        },
        postlogin(req, res, next) {
            const { email, password }   = req.body
            console.log('kiju');
            
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }
                    return res.redirect('/login')

                })
            })(req, res, next)
        },

       async postregister(req,res){
            let {name,email,password} = req.body;
            /// valiudate req
            if(!name || !email || !password){
                req.flash('error','All Field required');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register')
            }
            User.exists({email},(err,res)=>{
                if(res){
                    req.flash('error','Emiil allready exists');
                    req.flash('name',name);
                    req.flash('email',email);
                    return res.redirect('/register')
                }
            })
             
            const hashpass = await bcrypt.hash(password,10);
            //// create user
            let user = new User({
                name,
                email,
                password:hashpass
            });
            user.save().then(()=>{
                //// login
                return res.redirect('/register')
            }).catch((err)=>{
                req.flash('error','some thing went wrong');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register')
            })
        },
        
        logout(req,res){
            req.logout();
            return res.redirect('/');
        }
    }   
}
module.exports = authcontroller;