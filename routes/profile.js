var express=require("express"),
	router=express.Router(),
	mongoose=require("mongoose"),
	movies=require("../models/movies"),
	screening=require("../models/screening"),
	reservation=require("../models/reservation");



router.get("/profile/:username",function(req,res)
{
	console.log(req.params.username);
	reservation.find({username:req.params.username}).populate("screening_id").exec(function(err,bookings)
	{
		if(err)
		{

			req.flash("error","No Reservations Found!!")
			res.render("profile");
			console.log(err);
		}
		else
		{
				res.render("profile",{bookings:bookings});
		}
		
	})
})
router.post("/profile/:username",function(req,res)
{
	console.log(req.params.username);
	reservation.find({username:req.params.username}).populate("screening_id").exec(function(err,bookings)
	{
		if(err)
		{

			req.flash("error","No Reservations Found!!")
			res.render("profile");
			console.log(err);
		}
		else
		{
				res.render("profile",{bookings:bookings});
		}
		
	})
})





function isUser(req,res,next)
	{
		if(req.isAuthenticated())
			return next();
		req.flash("error","You Must be signed in as User");
		res.redirect("/admin/login");
	}


module.exports=router;