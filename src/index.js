// const ParksAPI = require('./scripts/parksAPI');
// ParksAPI.data();
const US_MAP = require('./scripts/us_map')
const Lightbox = require('./scripts/parksLightbox')


let parks;
let searchedParks;


document.addEventListener("DOMContentLoaded", () => {

    /*
        Information Modal Event Listeners
    */
    {
        // Open Information Modal
        document.getElementById("info-button").addEventListener("click",(event)=>{
            event.preventDefault();
            console.log("hi")
            document.getElementsByClassName("info-modal")[0].style.display = "block";
        })
        
        // 'X' out of Information Modal
        document.getElementsByClassName("close-info")[0].addEventListener("click",(event)=>{
            event.preventDefault();
            document.getElementsByClassName("info-modal")[0].style.display = "none";
        })

        // 'X' out of Information Modal if the black backdrop is clicked
        document.getElementsByClassName("info-position")[0].addEventListener("click",(event)=>{
            event.preventDefault()
            event.stopPropagation();
            if (event.target === event.currentTarget){
                document.getElementsByClassName("info-modal")[0].style.display = "none";
            }
        })

    }

    document.getElementById("daysOpen").addEventListener("click",(event)=>{
        // event.preventDefault();
        event.stopPropagation();
        setTimeout(()=>{
            let selected = event.target.children[0]
            if (selected && selected.checked){
                event.target.style.backgroundColor = "#d0c7a8"
            } else {
                event.target.style.backgroundColor = "#fff4cf"
            }
        },0)
    })
    document.getElementById("daysOpen").addEventListener("mouseover",(event)=>{
        event.stopPropagation();
        if (event.target.className === "day"){
            event.target.style.backgroundColor = "#d0c7a8"
        }
    })
    document.getElementById("daysOpen").addEventListener("mouseout",(event)=>{
        event.stopPropagation();
        if (event.target.className === "day"){
            let selected = event.target.children[0].checked
            if (selected){
                event.target.style.backgroundColor = "#d0c7a8"
            } else {
                event.target.style.backgroundColor = "#fff4cf"
            }
        }
    })

    document.getElementById("activities").addEventListener("click",(event)=>{
        // event.preventDefault();
        event.stopPropagation();
        setTimeout(()=>{
            let selected = event.target.children[0]
            if (selected && selected.checked){
                event.target.style.backgroundColor = "#d0c7a8"
            } else {
                event.target.style.backgroundColor = "#fff4cf"
            }
        },1)
    })
    document.getElementById("activities").addEventListener("mouseover",(event)=>{
        event.stopPropagation();
        if (event.target.className === "act"){
            event.target.style.backgroundColor = "#d0c7a8"
        }
    })
    document.getElementById("activities").addEventListener("mouseout",(event)=>{
        event.stopPropagation();
        if (event.target.className === "act"){
            let selected = event.target.children[0].checked
            if (selected){
                event.target.style.backgroundColor = "#d0c7a8"
            } else {
                event.target.style.backgroundColor = "#fff4cf"
            }
        }
    })

    document.querySelector(".search-container form").addEventListener("submit",(event)=>{
        event.preventDefault();
        let searchTerm = event.target.elements[0].value
        // console.log(searchTerm)
        fetch(`https://developer.nps.gov/api/v1/parks?limit=467&q=${searchTerm}&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN`)
            .then(res => res.json())
            .then(res => searchedParks = res.data)
            .then(() => {
                if (searchedParks.length > 0){
                    updatesParkListBySearch(searchedParks)
                } else {/*Nothing happens if the results are empty*/}
            })
        // Clears out the search bar
        event.target.elements[0].value = ""
    })

    fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
        .then(res => res.json())
        .then(res => parks = res.data)
        .then(populateMap)
        .then(populateAllParks)
})

function updatesParkListBySearch(parkSubset){
    let idList = [];
    parkSubset.forEach((park) =>{idList.push(park.id) })
    let parkScroll = document.getElementById("parks_ul");
    for(let i = 0; i < parkScroll.children.length; i++){
        let parkListElement = parkScroll.children[i];
        if (idList.includes(parkListElement.data)){ parkListElement.style.display = "block"} 
        else { parkListElement.style.display = "none"}
    }
}

function populateMap(){
    US_MAP.generateMap(parks, Lightbox);
    // console.log(parks)
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
        }
    })
}
