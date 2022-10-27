const express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
	helmet = require('helmet');
const https = require("https");
const qs = require("querystring");
const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config"),
	admin = require("./models/admin"),
	screening = require("./models/screening"),
	reservation = require("./models/reservation"),
	seed = require("./seed");
app.use(helmet());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/bookmyshow", { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connected to DB");
app.use(methodOverride("_method"));
app.use(flash());
seed();
console.log("DB Seed complete");

app.post("/paynow/:id", (req, res) => {
  var S=req.body.check_list;
	var name=req.body.username;
	var seatNum=req.body.seatNum;
	var amount= req.body.amount;

	var newReservation={
		username:name,
		email:req.body.email,
		contact:req.body.contact,
		seats:req.body.check_list,
		screening_id:req.params.id

	};
	console.log(req.body.check_list);
	
	S.forEach(function(seat)
	{
		console.log(seat);
		screening.updateOne({"_id":req.params.id,"seats.id":seat},{$set:{"seats.$.available":false}},function(err,updated)
		{
			if(err)
				console.log(err);
			else
				console.log(updated);
		});
		

	});
	var reservation_id;
	reservation.create(newReservation,function(err,r)
	{
		if(err)
			console.log(err);
		else
		{
			console.log("new reservation created");
			reservation_id=r._id;
			console.log(reservation_id);
			reservation.findById(reservation_id).populate("screening_id").exec(function(err,reservation)
			{
				if(err)
					console.log(err);
				else
				{
					console.log(reservation); if(!amount || !name || !newReservation.email || !newReservation.contact) {
						res.status(400).send('Payment failed')
					} else {
						var params = {};
						params['MID'] = config.PaytmConfig.mid;
						params['WEBSITE'] = config.PaytmConfig.website;
						params['CHANNEL_ID'] = 'WEB';
						params['INDUSTRY_TYPE_ID'] = 'Retail';
						params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
						params['CUST_ID'] = name;
						params['TXN_AMOUNT'] = amount;
						params['CALLBACK_URL'] = `http://localhost:3000/profile/${name}`;
						params['EMAIL'] = newReservation.email;
						params['MOBILE_NO'] = newReservation.contact;
					
					
						checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
						   //  var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
							var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
					
							var form_fields = "";
							for (var x in params) {
								form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
							}
							form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
					
							res.writeHead(200, { 'Content-Type': 'text/html' });
							res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
							res.end();
						});
					}
				}
			})
			
			
		}

	});

 
  });

var indexRoutes = require("./routes/index");
var moviesRoutes = require("./routes/movies");
var screeningRoutes = require("./routes/screening");
var bookingRoutes = require("./routes/booking");
var authenticationRoutes = require("./routes/authentication");
var search = require("./routes/check");
var profile = require("./routes/profile");
app.use(require("express-session")(
	{
		secret: "hello world",
		resave: false,
		saveUninitialized: false

	}
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());



app.use(function (req, res, next) {
	console.log(req.user);
	res.locals.admin = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(moviesRoutes);
app.use(screeningRoutes);
app.use(bookingRoutes);
app.use(authenticationRoutes);
app.use(search);
app.use(profile);


let port = process.env.PORT || 3000;

app.listen(port, function (err) {
	if (err)
	console.log(err);
	else
	console.log(`Server started at port ${port}`);
});
