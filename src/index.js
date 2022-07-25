// const ParksAPI = require('./parksAPI');
 const US_MAP = require('./scripts/us_map')
//  const  = require('./scripts/us_map')
// let api_data = ParksAPI.data();

// let node1 = document.createElement("h1")
// node1.innerHTML("POOPOO")
// document.getElementById("body").appendChild(node1)


let parks;
// fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')

document.addEventListener("DOMContentLoaded", () => {
    fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
        .then(res => res.json())
        .then(res => parks = res.data)
        .then(populateMap)
        .then(populateAllParks)
})

function populateMap(){
    US_MAP.generateMap(parks);
    console.log(parks)
    // console.log(Object.keys(parks));
}

function populateAllParks(){
    // Some national parks are not rendered because they do not appear on the geoAlbers projection. It should be decided whether or not these should have a parks page
    let parks_list = document.getElementById("parks_ul");
    for(let i = 0; i < parks.length; i++){
        const node = document.createElement("li");
        node.innerText = `${parks[i].fullName}, ${parks[i].states}`;
        node.data = parks[i].id
        parks_list.appendChild(node);
    }

    parks_list.addEventListener('mouseover', (event) => {
        event.preventDefault();
        if (event.target.data){
            let parkDot = document.getElementById(event.target.data)
            parkDot.style.fill = "yellow"
            parkDot.setAttribute("r",5)
            parkDot.style.zIndex = 10000
        }
    })

    parks_list.addEventListener('mouseout', (event) => {
        event.preventDefault();
        if (event.target.data){
            let parkDot = document.getElementById(event.target.data)
            parkDot.style.fill = "green"
            parkDot.setAttribute("r",2)
            parkDot.style.zIndex = 500
            // console.log(parkDot)
        }
    })
}
