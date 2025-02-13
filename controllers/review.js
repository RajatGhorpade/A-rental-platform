const Listing=require('../models/listing');
const Review=require('../models/review');

//*creating review
module.exports.createReview=async(req,res)=>
    {
         let listing=await Listing.findById(req.params.id);
         let newReview=new Review(req.body.review);
         newReview.author=req.user._id;
    
         listing.review.push(newReview);
    
         await newReview.save();
         await listing.save();
    
         console.log('new review saved');
         req.flash('success','Review added successfully');
         res.redirect(`/listings/${listing._id}`);
    }

 //*deleting review
 module.exports.deleteReview=async(req,res)=>
     {
         let{id,reviewId}=req.params;
         
         await Review.findByIdAndDelete(reviewId);
         await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
         req.flash('success','Review deleted successfully');
         res.redirect(`/listings/${id}`);
     }