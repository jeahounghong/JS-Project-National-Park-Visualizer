// const ParksAPI = require('./parksAPI');
 const US_MAP = require('./scripts/us_map')
// let api_data = ParksAPI.data();


let parks;
// fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')

document.addEventListener("DOMContentLoaded", () => {
    fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
        .then(res => res.json())
        .then(res => parks = res.data)
        .then(populateMap)
        // .then(() => parks = data.data)
        // .then(() => console.log(parks))
})

function populateMap(){
    US_MAP.generateMap(parks);
    console.log(parks)
    console.log(Object.keys(parks));
}