var express=require("express"),
	mongoose=require("mongoose"),
	omdbApi=require("omdb-client"),
	router=express.Router(),
	request=require("request"),
	movies=require("../models/movies");

router.get("/movie",isAdmin,function(req,res)
{
	movies.find({},function(err,allmovies)
		{
			if(err)
				console.log(err);
			else
				res.render("movies/movie-manage",{movies:allmovies});
		});
	
})
router.get("/movie/create",isAdmin,function(req,res)
{
	res.render("movies/create.ejs");
});

router.post("/movie/create",isAdmin,function(req,res)
{
	var name=req.body.name;
	var img=req.body.img;
	var ratings=req.body.ratings;
	var director=req.body.director;
	var summary=req.body.summary;
	var release=req.body.release;
	var duration=req.body.duration;

	var newmovie={name:name,img:img,ratings:ratings,director:director,summary:summary,release:release,duration:duration};
	movies.create(newmovie,function(err,movie)
	{
		if(err)
			console.log(err);
		else
		{
			console.log("new movie created");
			req.flash("success","Successfully Added a New Movie");
			res.redirect("/movie");
		}
	})

	});

router.delete("/movie/:id",isAdmin,function(req,res)
{
	movies.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Their was some Error");
			res.redirect("/movie");
		}
		else
		{
			console.log("movie deleted");
			req.flash("sucess","Movie Deleted");
			res.redirect("/movie");
		}
	})
});


	function isAdmin(req,res,next)
	{
		if(req.isAuthenticated()&&req.user.isAdmin==true)
			return next();
		req.flash("error","You Must be signed in as admin");
		res.redirect("/admin/login");
	}

	


module.exports=router;
