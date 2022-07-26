export function generateMap(parks, Lightbox){

    // var *currentState*: will be responsible for the location displayed beneath the map
    let currentState = "United States of America"

    // var *state_features*: holds a key value pair for the state name and the feature that will be passed 
    //                       into the clicked function
    let states_features = {};
    let currentParkId;


   
    // var *idToStates* holds the key value pairs of the US topojson id's to their respective states
    const idToStates = {
        1: "AL", 2: "AK", 3: "AR", 4: "AZ", 5: "AR", 6: "CA", 7: "CT", 8: "CO", 9: "CT", 10: "DE",
        11: "GA", 12: "FL", 13: "GA", 14: "IL", 15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA",
        20: "KS", 21: "MD", 22: "LA", 23: "ME", 24: "MD", 25: "MA", 26: "MI", 27: "MN", 28: "NE",
        29: "MO", 30: "MT", 31: "NE", 32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC",
        38: "ND", 39: "OH", 40: "OK", 41: "OR", 42: "PA", 43: "TN", 44: "RI", 45: "SC", 46: "SD",
        47: "TN", 48: "TX", 49: "UT", 50: "VT", 51: "VA", 53: "WA", 54: "WV", 55: "WI" , 56: "UT"  
    }
    
    // var *AbToState* takes an abbreviation and converts it to the full state name
    const AbToState = {
        "AL": "Alabama", "AK": "Alaska", "AR": "Arkansas", "AZ": "Arizona", "CA": "California",
        "CT": "Connecticut", "CO": "Colorado", "DE": "Delaware", "GA": "Georgia", "FL": "Florida",
        "IL": "Illinois", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana",
        "IA": "Iowa", "KS": "Kansas", "MD": "Maryland", "LA": "Louisiana", "ME": "Maine",
        "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "NE": "Nebraska", "MO": "Missouri",
        "MT": "Montana", "NV": "Nevada", "NH": "New Hampshire", "NM": "New Mexico", "NC": "North Carolina",
        "NY": "New York", "NJ": "New Jersey", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
        "OR": "Oregon", "PA": "Pennsylvania", "TN": "Tennessee", "RI": "Rhode Island", "SC": "South Carolina",
        "SD": "South Dakota", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
        "WV": "West Virginia", "WI": "Wisconsin"
    }
   
    document.addEventListener('submit', (event)=>{
        event.preventDefault();
        let state = document.getElementById("state_select").value;
        let activitiesForm = document.getElementById("activities");
        let activities = {}
        for(let i = 0; i < activitiesForm.children.length; i++){
            activities[activitiesForm.children[i].children[0].value] = activitiesForm.children[i].children[0].checked
        }
        zoomToState(state);
    })

    document.getElementById("parks_ul").addEventListener("click", (event)=>{
        event.preventDefault();
        // console.log(event.target.data)
        if (event.target.data){
            showParkPage(event.target.data)
        }
    })

    document.getElementById("park-close").addEventListener("click", (event)=>{
        event.preventDefault();
        d3.select(".parks-sidebar-search").style('display','block')
        d3.select(".park-showpage").style('display','none')
        reset();
    })

    /*
        Event Listeners for Photo Lightbox Modal
    */
    { // Handling photo lightbox modals
        document.querySelector(".small-images").addEventListener("click", (event)=>{
            event.preventDefault();
            console.log(event.target)
            Lightbox.openModal();
            Lightbox.currentSlide(event.target)
        })
        
        /*
            Handling ways to close to photo lightbox modal
        */
        {
            // Explicitly slicking the "close" icon
            document.querySelector(".close-button").addEventListener("click",(event)=>{
                event.preventDefault();
                Lightbox.closeModal();
            })

            // Clicking on black backdrop to close the modal
            document.getElementsByClassName("photo-modal-content")[0].addEventListener("click",(event)=>{
                event.preventDefault()
                event.stopPropagation();
                if (event.target === event.currentTarget){
                    Lightbox.closeModal();
                }
            })
            document.getElementById("photoModal").addEventListener("click",(event)=>{
                event.preventDefault()
                event.stopPropagation();
                if (event.target === event.currentTarget){
                    Lightbox.closeModal();
                }
            })
        }

        document.querySelector(".modal-image-previews").addEventListener("click", (event)=>{
            event.preventDefault();
            if (event.target){
                console.log(event.target.src)
                document.getElementById("main-modal-image").src = event.target.src;
            }
        })

        document.querySelector(".prev").addEventListener("click",(event)=>{
            let currentSource = document.getElementById("main-modal-image").src;
            let modalPreviews = document.getElementsByClassName("modal-image-previews")[0].children
            for(let i = 0; i < modalPreviews.length; i++){
                if (modalPreviews[i].src === currentSource){
                    if (i === 0){
                        document.getElementById("main-modal-image").src = modalPreviews[modalPreviews.length-1].src
                    } else {
                        document.getElementById("main-modal-image").src = modalPreviews[i-1].src
                    }

                }
            }
        })

        document.querySelector(".next").addEventListener("click",(event)=>{
            let currentSource = document.getElementById("main-modal-image").src;
            let modalPreviews = document.getElementsByClassName("modal-image-previews")[0].children
            for(let i = 0; i < modalPreviews.length; i++){
                if (modalPreviews[i].src === currentSource){
                    let new_idx = (i + 1) % modalPreviews.length;
                    document.getElementById("main-modal-image").src = modalPreviews[new_idx].src
                }
            }
        })
    }

    var margin = {
        // top: 10,
        // bottom: 10,
        // left: 10,
        // right: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, width = parseInt(d3.select('.viz').style('width'))
        , width = width - margin.left - margin.right - 2*parseFloat(d3.select('.viz').style('padding'))
        , mapRatio = 0.6 // previously 0.5
        , height = width * mapRatio
        , active = d3.select(null);

    var svg = d3.select('.viz').append('svg')
        .attr('class', 'center-container')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right);

    svg.append('rect')
        .attr('class', 'background center-container')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .on('click', clicked);

    Promise.resolve(d3.json('https://gist.githubusercontent.com/mbostock/4090846/raw/us.json'))
        .then(ready);

    let projection = d3.geoAlbersUsa()
        .translate([width /2 , height / 2])
        .scale(width);

    var path = d3.geoPath()
        .projection(projection);

    var g = svg.append("g")
        .attr('class', 'center-container center-items us-state')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    
    let header = d3.select('.viz').append('div').attr('class','location-viewer')
        .append('div')
        .attr('class','location')
        .html(`You are currently viewing: ${currentState}`)

    function ready(us) {
        g.append("g")
            .attr("id", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "county-boundary")
            .on("click", reset);

        g.append("g")
            .attr("id", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "state")
            .attr("id", (d)=>{
                // console.log(d);
                if (idToStates[d.id]){
                    states_features[idToStates[d.id]] = d
                    return idToStates[d.id];
                } else {
                    return `${d.id}`
                }
            })
            .on("click",clicked);

        console.log(states_features)

        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", path);
        
        g.append("g")
            .attr("id", "parks-dots")
            .selectAll("path")
            .data(parks)
            .enter().append("circle")
            .attr("id", function(d){
                return d.id;
            })
            .attr("class", "parks")
            .attr("r", 2)
            .attr("cx", function(d){
                let coords = projection([parseFloat(d.longitude),parseFloat(d.latitude)])
                if (coords){
                    return coords[0];
                } else {
                    return null;
                }
            })
            .attr("cy", function(d){
                let coords = projection([parseFloat(d.longitude),parseFloat(d.latitude)])
                if (coords){
                    return coords[1];
                } else {
                    return null;
                }
            })
            .append("span")
            .attr("class","tooltiptext")
            .html((d)=>d.fullName)


            // After the park dots have been created, an event listener is added to them
            document.getElementById("parks-dots").addEventListener("click", (event) =>{
                event.preventDefault();
                event.stopPropagation();
                showParkPage(event.target.id)
            })

            document.getElementById("parks-dots").addEventListener("mouseover", (event)=>{
                event.preventDefault();
                let parkDot = event.target;
                parkDot.remove();
                document.getElementById("parks-dots").appendChild(parkDot);

                parkDot.style.fill = "yellow";
                let selectedParkRadius = document.querySelector(".location").innerHTML.includes("United States of America") ? 6 : 3;
                parkDot.setAttribute("r", selectedParkRadius)
                parkDot.style.zIndex = 10000
            })
            document.getElementById("parks-dots").addEventListener("mouseout", (event)=>{
                event.preventDefault();
                let parkDot = event.target;
                if (currentParkId === parkDot.id){
                    makeDotRed(parkDot);
                } else{
                    parkDot.style.fill = "green";
                    let parkRadius = document.querySelector(".location").innerHTML.includes("United States of America") ? 2 : 1;
                    parkDot.setAttribute("r", parkRadius)
                    parkDot.style.zIndex = 500
                }
            })

    }

    function clicked(d) {
        console.log("click!")
        currentState = idToStates[d.id];
        updatesParksList(currentState);
        d3.selectAll('.parks').attr("r",1)
        d3.select('.location').html(`You are currently viewing: ${AbToState[currentState]}`)

        if (d3.select('.background').node() === this){
            // console.log(d3.select('.background'))
            // console.log(d3.select('.background').node())
            return reset();  
        } 
        // if (active.node() === this) {
        //     console.log(active)
        //     console.log(active.node())
        //     return reset()
        // };

        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = .9 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    function zoomToState(state){
        // updatesParksList(state);

        if (state === "any"){
            reset()
        } else {
            for(let i =1; i < 60; i++){
                if (idToStates[i] === state){
                    // clicked(states_features[state])//.bind(document.getElementById(state));
                    clicked.bind(document.getElementById(state),states_features[state])() //.bind(document.getElementById(state));
                }
            }
        }
    }

    function updatesParksList(state){
        let stateScroll = document.getElementById("parks_ul");
        for(let i = 0; i < stateScroll.children.length; i++){
            let parkListElement = stateScroll.children[i];
            if (state === "any" || state === ""){
                parkListElement.style.display = "block"
            }
            else if (parkListElement.innerHTML.includes(state)){
                parkListElement.style.display = "block"
            } else {
                parkListElement.style.display = "none"
            }
        }
    }


    /*
        This function is responsible for rendering the entire park page. It should load:
            - park NAME
            - park DESCRIPTION
            - park OPERATING HOURS
            - park ACTIVITIES
    */
    function showParkPage(park_id) {
        currentParkId = park_id;
        // Declares var showPark to show selected park 
        let showPark;

        // Search for park from parks
        for(let i = 0; i < 467; i++){
            document.getElementById(parks[i].id).style.fill = "green"
            document.getElementById(parks[i].id).setAttribute('r',1)

            if (parks[i].id === park_id){
                showPark = parks[i]
            }
        }
        
        let showParkDot = document.getElementById(showPark.id);
        setTimeout(function(){
            makeDotRed(showParkDot)
        },500)
        // setTimeout((parkDot)=>{
        //     let parkDot = 
        //     parkDot.remove();
        //     document.getElementById("parks-dots").appendChild(parkDot);
        //     parkDot.style.fill = "#bd2d17";
        //     parkDot.setAttribute('r',2);
        // },500)

        // Zoom to appropriate state
        // if ()
        zoomToState(showPark.states)

        // Adds park name
        d3.select("#park-name").html(`${showPark.fullName}`)
        d3.select("#park-name").attr("href", `${showPark.url}`)

        // Adds park description
        document.querySelector(".description p").innerHTML = showPark.description

        // Adds the Operating Hours
        removeAllChildNodes("hoursOfOp-ul")
        let node1 = document.querySelector(".hoursOfOp-ul")
        for (let i = 0; i < showPark.operatingHours.length; i++){
            let descriptionOfHours = document.createElement("li")
            descriptionOfHours.innerHTML = showPark.operatingHours[i].description
            node1.appendChild(descriptionOfHours)
        }

        // Adds the Activities
        removeAllChildNodes("activities-ul")
        let node = document.querySelector(".activities-ul")
        for (let i = 0; i < showPark.activities.length;i++){
            let activity = document.createElement("li")
            activity.innerHTML = showPark.activities[i].name
            node.appendChild(activity);
        }

        // Setting Google Maps location
        document.getElementById("parks-maps").src  = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD4MfnERKAJsAGVZVESAGKtLS7M3xm29_c&q=${showPark.fullName}+${showPark.states}`

        // Flickr_URL
        let flickrURL = 
            `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e19ad1e0c6bf594b6f00d76788a2ad44&format=json&nojsoncallback=1&text=${showPark.fullName}&extras=url_o`
        
        // Prepares the image list and modal images by removing all children
        removeAllChildNodes("small-images")
        removeAllChildNodes("modal-image-previews")
        let lightbox = document.querySelector(".small-images");
        let modal = document.getElementsByClassName("modal-image-previews")[0];
        let count = 0;

        for (let i = 0; i < showPark.images.length;i ++){
            count += 1;
            let image = document.createElement("img");
            image.src = showPark.images[i].url;
            image.loading = 'lazy';
            lightbox.appendChild(image);
            // modal.appendChild(image);
        }
        for (let i = 0; i < showPark.images.length;i ++){
            // count += 1;
            let image = document.createElement("img");
            image.src = showPark.images[i].url;
            image.loading = 'lazy';
            // lightbox.appendChild(image);
            modal.appendChild(image);
        }
        
        // Populating the images
        fetch(flickrURL)
            .then(res => res.json())
            .then(images => images.photos.photo)
            .then((images) => {

                for(let i = 0; i < 10; i++){
                    if (images[i].url_o){
                        count += 1  
                        let image = document.createElement("img")
                        image.src = `${images[i].url_o}`;
                        image.loading = "lazy"
                        lightbox.appendChild(image)
                        modal.appendChild(image)
                    }
                }
            }).then(()=>{
                // Clears out search-bar and renders parks showpage
                d3.select(".parks-sidebar-search").style('display','none')
                d3.select(".park-showpage").style('display','block')
            })
    }

    // function removeElementsByClass(className){
    //     const elements = document.getElementsByClassName(className);
    //     while(elements.length > 0){
    //         elements[0].parentNode.removeChild(elements[0]);
    //     }
    // }


    function removeAllChildNodes(className){
        let parent = document.getElementsByClassName(className)[0];
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function makeDotRed(parkDot){
        parkDot.remove();
        document.getElementById("parks-dots").appendChild(parkDot);
        parkDot.style.fill = "#bd2d17";
        parkDot.setAttribute('r',2);
    }

    // function drawParksByState(stateId){
    //     g.append("g")
    //         .selectAll("path")
    //         .data(parks)
    //         .enter().append("circle")
    //         .attr("id", function(d){
    //             return d.id;
    //         })
    //         .attr("class", "parks")
    //         // .attr("id", d.id)
    //         .attr("r", 2)
    //         .attr("cx", function(d){
    //             console.log(d)
    //             let coords = projection([parseFloat(d.longitude),parseFloat(d.latitude)])
    //             if (coords && d.states === idToStates[stateId]){
    //                 return coords[0];
    //             } else {
    //                 return null;
    //             }
    //         })
    //         .attr("cy", function(d){
    //             let coords = projection([parseFloat(d.longitude),parseFloat(d.latitude)])
    //             if (coords && d.states === idToStates[stateId]){
    //                 return coords[1];
    //             } else {
    //                 return null;
    //             }
    //         })
    // }



    function reset() {

        d3.select(".parks-sidebar-search").style('display','block')
        d3.select(".park-showpage").style('display','none')
        d3.selectAll('.parks').attr("r",2)
        d3.selectAll('.parks').style("fill","green")
        updatesParksList("any");
        currentState = "United States of America"
        d3.select('.location').html(`You are currently viewing: ${currentState}`)
        active.classed("active", false);
        active = d3.select(null);

        g.transition()
            .delay(100)
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr('transform', 'translate('+margin.left+','+margin.top+')');
    }

}
// module.exports.generateMap = us_map;