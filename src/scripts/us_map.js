// document.addEventListener("DOMContentLoaded", () => {
export function generateMap(parks){

    document.addEventListener('submit', (event)=>{
        event.preventDefault();
        let state = document.getElementById("state_select").value;
        let statePath = document.getElementById(state);
        zoomToState(state);
    })

    let states_features = [];

    const idToStates = {
        1: "AL", 2: "AK", 3: "AR", 4: "AZ", 5: "AR", 6: "CA", 7: "CT", 8: "CO", 9: "CT", 10: "DE",
        11: "GA", 12: "FL", 13: "GA", 14: "IL", 15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA",
        20: "KS", 21: "MD", 22: "LA", 23: "ME", 24: "MD", 25: "MA", 26: "MI", 27: "MN", 28: "NE",
        29: "MO", 30: "MT", 31: "NE", 32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC",
        38: "ND", 39: "OH", 40: "OK", 41: "OR", 42: "PA", 43: "TN", 44: "RI", 45: "SC", 46: "SD",
        47: "TN", 48: "TX", 49: "WV", 50: "VT", 51: "VA", 53: "WA", 54: "WV", 55: "WI"   
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
        , width = width - margin.left - margin.right
        , mapRatio = 0.5 // previously 0.5
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

    // console.log(projection)
    // console.log(`Projection: ${projection([145.7231096, 15.21680033])}`)

    var path = d3.geoPath()
        .projection(projection);

    var g = svg.append("g")
        .attr('class', 'center-container center-items us-state')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

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
                console.log(d);
                if (idToStates[d.id]){
                    console.log(d.id);
                    console.log(idToStates[d.id])
                    states_features.push(d)
                    return idToStates[d.id];
                } else {
                    return `${d.id}`
                }
            })
            .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", path);
        
        g.append("g")
            // .attr("id","parks")
            .selectAll("path")
            .data(parks)
            .enter().append("circle")
            .attr("id", function(d){
                return d.id;
            })
            .attr("class", "parks")
            // .attr("id", d.id)
            .attr("r", 2)
            .attr("cx", function(d){
                // console.log(d.id)
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
    }

    function clicked(d) {
        console.log(d)

        if (d3.select('.background').node() === this) return reset();

        if (active.node() === this) return reset();

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
        console.log(state)
        for(let i =1; i < 60; i++){
            if (idToStates[i] === state){
                console.log(i)
                clicked(states_features[i-1])
            }
        }
    }

    function reset() {
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