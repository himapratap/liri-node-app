var key = require("./key");
var twitterKeys = key.twitterKeys;
var spotify = require('spotify');

console.log(twitterKeys.consumer_key);




// spotify-this-song
//
// movie-this
//
// do-what-it-says
var args = process.argv;
var cmd = args[2];

switch (cmd) {
    case 'my-tweets':
        console.log('Getting my tweets');
        break;
    case 'spotify-this-song':
        var song = '';

        for (var i = 3; i < args.length; i++) {
            song = song + " " + args[i];
        }
        if ( song == '') {
            song = "The Sign by Ace of Base";
        }
        console.log(song);
        spotify.search({
            type: 'track',
            query: song
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
        break;

}
