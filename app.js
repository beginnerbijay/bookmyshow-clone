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
const config = require("./Paytm/config");
admin = require("./models/admin"),
seed = require("./seed"),
app.use(helmet());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connected to DB");
app.use(methodOverride("_method"));
app.use(flash());
seed();
console.log("DB Seed complete");
app.post("/paynow", (req, res) => {
	var paymentDetails = {
	  S: req.body.check_list,
	  seatNum : req.body.seatNum,
	  amount: req.body.amount,
	  customerId: req.body.username,
	  customerEmail: req.body.email,
	  customerPhone: req.body.contact
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
	  res.status(400).send('Payment failed')
  } else {
	  var params = {};
	  params['MID'] = config.PaytmConfig.mid;
	  params['WEBSITE'] = config.PaytmConfig.website;
	  params['CHANNEL_ID'] = 'WEB';
	  params['INDUSTRY_TYPE_ID'] = 'Retail';
	  params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
	  params['CUST_ID'] = paymentDetails.customerId;
	  params['TXN_AMOUNT'] = paymentDetails.amount;
	  params['CALLBACK_URL'] = 'http://localhost:3000/book_seat/:id/update';
	  params['EMAIL'] = paymentDetails.customerEmail;
	  params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
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
  }module.exports.paymentDetails = paymentDetails;
  });

  app.post("/book_seat/:id/update",function(req,res){

	
	// var V=paymentDetails.check_list;
	// var name=paymentDetails.customerId;
	// var seatNum=paymentDetails.seatNum;

	// var newReservation={
	// 	username:name,
	// 	email:payment.email,
	// 	contact:payment.contact,
	// 	seats:V,
	// 	screening_id:payment.id

	// };
	// console.log(payment.check_list);
	

	// 	console.log(seat);
	// 	screening.updateOne({"_id":payment.id,"seats.id":seat},{$set:{"seats.$.available":false}},function(err,updated)
	// 	{
	// 		if(err)
	// 			console.log(err);
	// 		else
	// 			console.log(updated);
	// 	});
		
	// var reservation_id;
	// reservation.create(newReservation,function(err,r)
	// {
	// 	if(err)
	// 		console.log(err);
	// 	else
	// 	{
	// 		console.log("new reservation created");
	// 		reservation_id=r._id;
	// 		console.log(reservation_id);
	// 		reservation.findById(reservation_id).populate("screening_id").exec(function(err,reservation)
	// 		{
	// 			if(err)
	// 				console.log(err);
	// 			else
	// 			{
	// 				console.log(reservation);
					res.render("booking/finalTicket");
				


	
});
  app.post("/callback", (req, res) => {
	// Route for verifiying payment
  
	var body = '';
  
	req.on('data', function (data) {
	   body += data;
	});
  
	 req.on('end', function () {
	   var html = "";
	   var post_data = qs.parse(body);
  
	   // received params in callback
	   console.log('Callback Response: ', post_data, "\n");
  
  
	   // verify the checksum
	   var checksumhash = post_data.CHECKSUMHASH;
	   // delete post_data.CHECKSUMHASH;
	   var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
	   console.log("Checksum Result => ", result, "\n");
  
  
	   // Send Server-to-Server request to verify Order Status
	   var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
	   console.log("verified")
  
	   checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
		 params.CHECKSUMHASH = checksum;
		 post_data = 'JsonData='+JSON.stringify(params);
  
		 var options = {
		 //   hostname: 'securegw-stage.paytm.in', // for staging
		  hostname: 'https://securegw.paytm.in', // for production
		   port: 443,
		   path: '/merchant-status/getTxnStatus',
		   method: 'POST',
		   headers: {
			 'Content-Type': 'application/x-www-form-urlencoded',
			 'Content-Length': post_data.length
		   }
		 };
  
  
		 // Set up the request
		 var response = "";
		 var post_req = https.request(options, function(post_res) {
		   post_res.on('data', function (chunk) {
			 response += chunk;
		   });
  
		   post_res.on('end', function(){
			 console.log('S2S Response: ', response, "\n");
  
			 var _result = JSON.parse(response);
			   if(_result.STATUS == 'TXN_SUCCESS') {
				   res.send('payment sucess')
			   }else {
				   res.send('payment failed')
			   }
			 });
		 });
  
		 // post the data
		 post_req.write(post_data);
		 post_req.end();
		});
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
