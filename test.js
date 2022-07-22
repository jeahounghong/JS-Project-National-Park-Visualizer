const yourApiKey = 'e19ad1e0c6bf594b6f00d76788a2ad44';

const data = {
  method: 'flickr.photos.search',
  api_key: yourApiKey,
  text: 'cat', // Search Text
  sort: 'interestingness-desc',
  per_page: 12,
  license: '4',
  extras: 'owner_name,license',
  format: 'json',
  nojsoncallback: 1,
};

const parameters = new URLSearchParams(data);

const url = `https://api.flickr.com/services/rest/?${parameters}`;
// console.log(url);
fetch(`https://api.flickr.com/services/rest/?${parameters}`)
  .then(response => response.json())
  .then(data => {
    // get an array of image-url
    console.log(data)
    data.photos.photo.map((photo) => {
      return getFlickrImageURL(photo, 'q');
    })
});