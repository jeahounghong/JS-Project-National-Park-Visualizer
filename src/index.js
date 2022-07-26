// const ParksAPI = require('./scripts/parksAPI');
// ParksAPI.data();
const US_MAP = require('./scripts/us_map')
const Lightbox = require('./scripts/parksLightbox')


let parks;



document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("info-button").addEventListener("click",(event)=>{
        event.preventDefault();
        console.log("hi")
        document.getElementsByClassName("info-modal")[0].style.display = "block";
    })
    
    document.getElementsByClassName("close-info")[0].addEventListener("click",(event)=>{
        event.preventDefault();
        document.getElementsByClassName("info-modal")[0].style.display = "none";
    })

    fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
        .then(res => res.json())
        .then(res => parks = res.data)
        .then(populateMap)
        .then(populateAllParks)
})

function populateMap(){
    US_MAP.generateMap(parks, Lightbox);
    console.log(parks)
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
            let parkDot = document.getElementById(event.target.data);
            parkDot.remove();
            document.getElementById("parks-dots").appendChild(parkDot);

            parkDot.style.fill = "yellow";
            let selectedParkRadius = document.querySelector(".location").innerHTML.includes("United States of America") ? 6 : 3;
            parkDot.setAttribute("r", selectedParkRadius)
            parkDot.style.zIndex = 10000
        }
    })

    parks_list.addEventListener('mouseout', (event) => {
        event.preventDefault();
        if (event.target.data){
            let parkDot = document.getElementById(event.target.data)
            parkDot.style.fill = "green";
            let parkRadius = document.querySelector(".location").innerHTML.includes("United States of America") ? 2 : 1;
            parkDot.setAttribute("r", parkRadius)
            parkDot.style.zIndex = 500
            // console.log(parkDot)
        }
    })
}
