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
        .then(populateAllParks)
        // .then(() => parks = data.data)
        // .then(() => console.log(parks))
})

function populateMap(){
    US_MAP.generateMap(parks);
    // console.log(parks)
    // console.log(Object.keys(parks));
}

function populateAllParks(){
    // Some national parks are not rendered because they do not appear on the geoAlbers projection. It should be decided whether or not these should have a parks page
    let parks_list = document.getElementById("parks_ul");
    for(let i = 0; i < parks.length; i++){
        const node = document.createElement("li");
        node.innerText = `${parks[i].fullName}, ${parks[i].states}`;
        parks_list.appendChild(node);
    }
    // console.log(parks.length)

}