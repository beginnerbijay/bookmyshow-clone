const mongoose = require("mongoose"),
	audi = require("./models/audi"),
	screening = require("./models/screening"),
	reservation = require("./models/reservation"),
	movies = require("./models/movies");




var data = [
	{
		name: "Minions The Rise Gru",
		img: "https://www.joblo.com/wp-content/uploads/2020/02/minions_the_rise_of_gru_xlg-1-400x600.jpg",
		summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet quam augue. Integer dignissim orci risus, in sodales mi vehicula id. Fusce sodales nisi dui, at egestas sem euismod in. Etiam dignissim eros quis tellus lobortis lobortis. Cras pellentesque orci sit amet metus vehicula faucibus. Praesent a tempor ligula. Vivamus eu pellentesque lorem. Duis varius non felis ac iaculis. Morbi placerat, libero a iaculis sagittis, felis eros malesuada quam, ut hendrerit mi eros quis ante. Mauris ultricies augue magna, vitae dignissim dui fermentum nec. Cras vel sem vehicula, sodales odio in, placerat nisl. In efficitur purus sapien, sit amet elementum eros molestie nec. Nulla id congue quam. Integer mollis lacus a dolor semper rhoncus. Aenean mauris arcu, pharetra in risus in, accumsan vestibulum purus. Mauris eu mauris faucibus, mattis augue aliquam, euismod quam.",
		ratings: "4.8",
		director: "Kyle Balda",
		release: "2022",
		duration: 90

	},
	{
		name: "Crimes Of Future",
		img: "https://www.joblo.com/wp-content/uploads/2022/05/crimes-of-the-future-poster-400x600.jpg",
		summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet quam augue. Integer dignissim orci risus, in sodales mi vehicula id. Fusce sodales nisi dui, at egestas sem euismod in. Etiam dignissim eros quis tellus lobortis lobortis. Cras pellentesque orci sit amet metus vehicula faucibus. Praesent a tempor ligula. Vivamus eu pellentesque lorem. Duis varius non felis ac iaculis. Morbi placerat, libero a iaculis sagittis, felis eros malesuada quam, ut hendrerit mi eros quis ante. Mauris ultricies augue magna, vitae dignissim dui fermentum nec. Cras vel sem vehicula, sodales odio in, placerat nisl. In efficitur purus sapien, sit amet elementum eros molestie nec. Nulla id congue quam. Integer mollis lacus a dolor semper rhoncus. Aenean mauris arcu, pharetra in risus in, accumsan vestibulum purus. Mauris eu mauris faucibus, mattis augue aliquam, euismod quam.",
		ratings: "4.5",
		director: "David Cronenberg",
		release: "2022",
		duration: 90
	},
	{
		name: "Jurassic world Dominion",
		summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet quam augue. Integer dignissim orci risus, in sodales mi vehicula id. Fusce sodales nisi dui, at egestas sem euismod in. Etiam dignissim eros quis tellus lobortis lobortis. Cras pellentesque orci sit amet metus vehicula faucibus. Praesent a tempor ligula. Vivamus eu pellentesque lorem. Duis varius non felis ac iaculis. Morbi placerat, libero a iaculis sagittis, felis eros malesuada quam, ut hendrerit mi eros quis ante. Mauris ultricies augue magna, vitae dignissim dui fermentum nec. Cras vel sem vehicula, sodales odio in, placerat nisl. In efficitur purus sapien, sit amet elementum eros molestie nec. Nulla id congue quam. Integer mollis lacus a dolor semper rhoncus. Aenean mauris arcu, pharetra in risus in, accumsan vestibulum purus. Mauris eu mauris faucibus, mattis augue aliquam, euismod quam.",
		img: "https://www.joblo.com/wp-content/uploads/2020/02/jurassic-world-3-poster-400x600.jpg",
		ratings: "4.2",
		director: "Colin Trevorrow",
		release: "2022",
		duration: 120
	},
	{
		name: "Thor:Love and Thunder",
		summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet quam augue. Integer dignissim orci risus, in sodales mi vehicula id. Fusce sodales nisi dui, at egestas sem euismod in. Etiam dignissim eros quis tellus lobortis lobortis. Cras pellentesque orci sit amet metus vehicula faucibus. Praesent a tempor ligula. Vivamus eu pellentesque lorem. Duis varius non felis ac iaculis. Morbi placerat, libero a iaculis sagittis, felis eros malesuada quam, ut hendrerit mi eros quis ante. Mauris ultricies augue magna, vitae dignissim dui fermentum nec. Cras vel sem vehicula, sodales odio in, placerat nisl. In efficitur purus sapien, sit amet elementum eros molestie nec. Nulla id congue quam. Integer mollis lacus a dolor semper rhoncus. Aenean mauris arcu, pharetra in risus in, accumsan vestibulum purus. Mauris eu mauris faucibus, mattis augue aliquam, euismod quam.",
		img: "https://www.joblo.com/wp-content/uploads/2019/07/thor-love-and-thunder-poster-2-400x600.jpg",
		ratings: "4.5",
		director: "Taika Waititi",
		release: "2022",
		duration: 200
	},

];
var th = [
	{
		name: "audi1",

		showTimes: [
			{
				start: 9,
				end: 12,
				available: true
			},
			{
				start: 12,
				end: 15,
				available: true
			},
			{
				start: 15,
				end: 18,
				available: true
			},
			{
				start: 18,
				end: 21,
				available: true
			}
		]
	},
	{
		name: "audi2",

		showTimes: [
			{
				start: 9,
				end: 12,
				available: true
			},
			{
				start: 12,
				end: 15,
				available: true
			},
			{
				start: 15,
				end: 18,
				available: true
			},
			{
				start: 18,
				end: 21,
				available: true
			}
		]
	},
	{
		name: "audi3",

		showTimes: [
			{
				start: 9,
				end: 12,
				available: true
			},
			{
				start: 12,
				end: 15,
				available: true
			},
			{
				start: 15,
				end: 18,
				available: true
			},
			{
				start: 18,
				end: 21,
				available: true
			}
		]
	}


]


 module.exports=function seed() {

	movies.deleteMany({}, function (err, res) {
		if (err)
			console.log(err)
		else
			console.log(res);
	});
	data.forEach(function (movie) {
		movies.create(movie, function (err, added) {
			if (err)
				console.log(err);
			else
				console.log(added);
		});

	});
	movies.updateMany({}, { $set: { "screening": true } }, function (err, Movies) {


		if (err)
			console.log(err);
		else
			console.log(Movies);

	});
	audi.deleteMany({}, function (err, res) {
		if (err)
			console.log(err)
		else
			console.log("deleted");
		th.forEach(function (th) {

			audi.create(th, function (err, newaudi) {
				if (err)
					console.log(err);
				else
					console.log("new audi created");
			});
		});

	});

	screening.deleteMany({}, function (err, res) {
		if (err)
			console.log(err);
		else
			console.log("All screens deleted");
	});

	reservation.deleteMany({}, function (err, res) {
		if (err)
			console.log(err);
		else
			console.log("all reservations deleted");
	});

	
}


