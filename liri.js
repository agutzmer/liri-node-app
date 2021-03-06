
var keys = require('./keys.js') 
var Twitter = require('twitter');
var omdb = require('omdb');
var spotify = require('spotify'); 

var fs = require('fs'); //reads and writes files


var switchUserRequest= function(userRequest, data){	
	
	switch(process.argv[2]) {
	    case 'my-tweets':
	        twitterSearch();
	        break;
	    case 'spotify-this-song':
	        spotifySearch(data);
	        break;
	    case 'movie-this':
	    	movieSearch(data);
	    	break;
	    case 'do-what-it-says':
	    	getDirectionsFromFile ();
	    	break;
	    default:
	        console.log('Command not understood.');
	}
}


var getDirectionsFromFile = function(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			console.log ("random.txt read error ", error);
			return;
		}

		var dataArr = data.split(',')

		console.log (dataArr[0].trim(), " ", dataArr[1].trim());

		switchUserRequest(dataArr[0].trim(), dataArr[1].trim());

	});
}

// https://www.npmjs.com/package/spotify
var spotifySearch = function(song){ 
	spotify.search({ type: 'track', query: song }, function(err, data) {
		if ( err ) {
			console.log('Spotify error: ' + err);
		}
		//console.log ("data = ", data.tracks.items[0]);
		
	    console.log ( "artists = ", data.tracks.items [0].artists[0].name);
	    console.log ( "preview url = ", data.tracks.items [0].preview_url);
	    console.log ( "album name = ", data.tracks.items [0].album.name);
	});
}

// https://www.npmjs.com/package/twitter
var twitterSearch = function(){
	 
	var client = new Twitter(keys.twitterKeys);
	 
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	if ( error ) {
        console.log('Twitter error: ' + err);
        return;
    }	
	console.log (tweets[0].text);	 
	});	
}

// https://www.npmjs.com/package/omdb
var movieSearch = function(movie){

	omdb.search(movie, function(err, data) {

	if ( err ) {
        console.log('omdb error: ' + err);
        return;
    }

   	if (data.length < 1) {
   		console.log ("No movies found.");
   		return;
   	}

    console.log ("title = ", data[0].title);
    console.log ("year = ", data[0].year);

	});
}
// The song or movie title may be multiword. Concatenate it into a string.
var inputTitle = '';

for (i = 3; i < process.argv.length; i++) {
	inputTitle = inputTitle.concat (process.argv[i]);
	inputTitle = inputTitle.concat (" ");
}

// switchUserRequest(process.argv[2], process.argv[3]);

switchUserRequest(process.argv[2], inputTitle);


