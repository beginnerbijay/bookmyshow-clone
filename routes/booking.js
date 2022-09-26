var express=require("express"),
	router=express.Router(),
	mongoose=require("mongoose"),
	movies=require("../models/movies"),
	screening=require("../models/screening"),
	reservation=require("../models/reservation");

router.get("/book/:id",isUser,function(req,res)
{
	movies.findById(req.params.id,function(err,movie)
			{
				if(err)
					console.log(err);
				else
				{
					screening.find({"movie.name":movie.name},function(err,screen)
					{
						if(err)
							console.log(err);
						else
						{
							console.log("screen found for booking");
							res.render("booking/bookMovie",{screen:screen,movie:movie});
						}
					});
					
				}
			});
});
router.get("/book_seat/:id",isUser,function(req,res)
{
	screening.findById(req.params.id,function(err,found)
	{
		if(err)
			console.log(err);
		else
		{

			res.render("booking/seatBooking",{screen:found});
		}
	});
	
});



 	function isUser(req,res,next)
	{
		if(req.isAuthenticated())
			return next();
		req.flash("error","You Must be signed in as User");
		res.redirect("/admin/login");
	}


 	module.exports=router;