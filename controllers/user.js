const User = require('../models/user');

//*signup
module.exports.renderSignupForm=(req,res)=>
    {
        res.render('users/signup.ejs');
    }

module.exports.signup=async(req,res)=>
{
    try
    {
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=> //automatic login after registering
        {
            if(err)
            {
                return next(err);
            }
            req.flash('success','Welcome to StaySpot!!');
            
        });
        
    }
    catch(err)
    {
        req.flash('error',err.message);
        res.redirect('/signup');
    }
    
}

//*login
module.exports.renderLoginForm=(req,res)=>
    {
        res.render('users/login.ejs');
    }

module.exports.login=async(req,res)=>
    {
        req.flash('success','welcome to StaySpot!!,You are logged in!!');
        let redirectUrl=res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
    }
    
//*logout
module.exports.logout=(req,res,next)=>
    {
        req.logout((err)=>
        {
            if(err)
            {
                next(err);
            }
            req.flash('success','You are logged out!!');
            res.redirect('/listings');
        })
    }    