require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body.access_token))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artist-search-results', {artists : data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistID', (req, res) => {
    let id = req.params.artistID;
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        console.log('Albums received', data.body.items);
        res.render('albums', {albums : data.body.items});
    })
    .catch(err => console.log(`Error while looking for the albums: ${err}`));
});

app.get('/tracks/:albumID', (req, res) => {
    let id = req.params.albumID;
    spotifyApi.getAlbumTracks(id)
    .then(data => {
        console.log(data.body.items);
        res.render('tracks', {tracks : data.body.items});
    })
    .catch(err => console.log(`Error while getting the tracks: ${err}`));
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
