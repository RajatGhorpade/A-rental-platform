const Listing=require('./models/listing');
const ExpressError=require('./utils/ExpressError');
const{listingSchema,reviewSchema}=require('./schema');
const Review=require('./models/review');


module.exports.isLoggedIn=(req,res,next)=>
{
    //console.log(req.user);
    if(!req.isAuthenticated())
        {
            //redirect to same url after login
            req.session.redirectUrl=req.originalUrl;
            req.flash('error','You must be logged in to create a new listing!!');
            return res.redirect('/login');
        }
        next();
}

module.exports.saveRedirectUrl=(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>
{
    let{id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currentUser._id))
        {
            req.flash('error','You do not have permission to edit this listing!!');
            return res.redirect(`/listings/${id}`);
        }
    next();
};


module.exports.isReviewAuthor=async(req,res,next)=>
    {
        let{id, reviewId}=req.params;
        let review=await Review.findById(reviewId);
            if(!review.author.equals(res.locals.currentUser._id))
            {
                req.flash('error','You do not have permission to delete this review!!');
                return res.redirect(`/listings/${id}`);
            }
        next();
    };


//!validations for schema in form of middleware
module.exports.validateListing=(req,res,next)=>
    {
        let {error}=listingSchema.validate(req.body);
       
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(',');
            //throw new ExpressError(400,error);
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
    };

 //!validations of serverside for Reviews
module.exports.validateReview=(req,res,next)=>
    {
        let {error}=reviewSchema.validate(req.body);
       
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(',');
            //throw new ExpressError(400,error);
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
    };
       
    