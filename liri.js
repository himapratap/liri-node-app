var key = require("./key");
var twitterKeys = key.twitterKeys;
var spotify = require('spotify');
var request = require('request');
var Twitter = require('twitter');
var fs = require('fs');

 console.log("My arg" +process.argv);

var args = process.argv;
var cmd = args[2];
var title = getTitle();
liriProcess(cmd);
//
// /** General function to get the title of song/movie provided as cmd arguments*/
 function getTitle() {
    var title = '';
    if (args.length > 2) {
        for (var i = 3; i < args.length; i++) {
            title = title.concat(args[i]).concat(" ");
        }
        // remove last added space from name
        title = title.substring(0, title.length - 1);
    }

    return title;
}

function liriProcess(cmd) {
     switch (cmd) {
        case 'my-tweets':
            console.log('Getting my tweets');
            showTweets();
            break;
        case 'spotify-this-song':
            if (title == '') {
                title = "The Sign by Ace of Base";
            }
            console.log("Searching for details of the song:" + title);
            showSongDetails();

            break;
        case 'movie-this':
            if (title == '') {
                title = 'Mr. Nobody';
            }
            console.log('Searching for details of the movie:' + title);
            showMovieDetails();
            break;

        case 'do-what-it-says':
            justDoIt();
            break;


    }
}


function justDoIt() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        var line = data.split(',');
        title = line[1];
        liriProcess(line[0]);

    });
}

function showTweets() {
    var client = new Twitter({
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret
    });
    var url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
    var params = {
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet : " + tweets[i].text);
                console.log("Created at : " + tweets[i].created_at);
            }
        }
    });

}



/**
 * Title of the movie.
 * Year the movie came out.
 * IMDB Rating of the movie.
 * Country where the movie was produced.
 * Language of the movie.
 * Plot of the movie.
 * Actors in the movie.
 * Rotten Tomatoes Rating.
 * Rotten Tomatoes URL
 */
function showMovieDetails() {
    var url = 'http://www.omdbapi.com/?t=' + title;
    request(url, function(error, response, body) {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var data = JSON.parse(body);
        if (error) {
            console.log('Error in retrieving movie details.' + title + " .Details:-" + error);
            return;
        } else if (response.statusCode == 200) {
            console.log("Title : " + data.Title);
            console.log("Year : " + data.Year);
            console.log("IMDB Rating : " + data.imdbRating);
            console.log("Country : " + data.Country);
            console.log("Language : " + data.Language);
            console.log("Plot : " + data.Plot);
            console.log("Actors : " + data.Actors);
            var ratings = data.Ratings;
            for (var i = 0; i < ratings.length; i++) {
                if (ratings[i].Source === 'Rotten Tomatoes') {
                    console.log("Rotten Tomatoes Rating : " + ratings[i].Value);

                }
            }
        }
    });
}

function showSongDetails() {
    spotify.search({
        type: 'track',
        query: title
    }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // Do something with 'data'
        //  console.log(JSON.stringify(data, null,2));
        console.log(" Artist :" + JSON.stringify(data.tracks.items[0].artists[0].name));
        console.log(" Song's name :" + JSON.stringify(data.tracks.items[0].name));
        console.log(" Preview Link :" + JSON.stringify(data.tracks.items[0].preview_url));
        console.log(" Album :" + JSON.stringify(data.tracks.items[0].album.name));
    });
}
