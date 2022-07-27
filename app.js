const express = require('express'); // web framework
const fetch = require('node-fetch'); // for making AJAX requests
const path = require('path');

// put environmental variables defined in .env file on process.env
require('dotenv').config(); 

const app = express();

// serve files / assets from the dist folder
app.use(express.static('dist')); 

// in response to `GET /` requests, send the file `dist/index.html`
app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/dist/index.html`);
});

// Heroku sets process.env.PORT in production; use 8000 in dev
const PORT = process.env.PORT || 8000;
// start up a server listening at PORT; on success, log a message
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});


// app.js
app.get("/parksAPI", (request,response) =>{
  const urlStart = 'https://developer.nps.gov/api/v1/parks?limit=467';
  const apiKey = process.env.parkAPIKEY;
  const searchTerm = request.query.searchTerm
  const url;
  if (searchTerm){
    url = `${urlStart}&q=${searchTerm}&api_key=${apiKey}`;
  } else {
    url = `${urlStart}&api_key=${apiKey}`;
  }

  console.log(`Fetching: ${url}`);

  fetch(url) // AJAX request to API
    .then(apiResponse => apiResponse.json())
    .then(data => response.send(data))
    .catch(error => response.send(error));
});

app.get('/flickrAPI', (request,response) =>{
  const urlStart = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='
  const apiKey = process.env.flickrAPIKEY;
  const searchTerm = request.query.searchTerm;
  const url = `${urlStart}${apiKey}&format=json&nojsoncallback=1&text=${searchTerm}&extras=url_o`

  console.log(`Fetching: ${url}`)

  fetch(url) // AJAX request to API
    .then(apiResponse => apiResponse.json())
    .then(data => response.send(data))
    .catch(error => response.send(error));
})