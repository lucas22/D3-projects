/**
 * Created by Lucas Parzianello on 2/27/16.
 */

// PARAMETERS:
var dataObject;
var dialog = false;
var dataFile = "data/data.json";
var xUsers=280, xPapers=880;
var width = $(window).width();
var height = $(window).height();
var cRadius = 8;
var w = 1280,
    h = 800,
    rx = w / 2,
    ry = h / 2,
    m0,
    rotate = 0;

var svgContainer, div;


// ELEMENT DRAWING:
function drawElements () {
    // Execute when data is loaded
    console.log(dataObject);

    var splines = [];

    var cluster = d3.layout.cluster()
        .size([360, ry - 120])
        .sort(function(a, b) { return d3.ascending(a.key, b.key); });

    var bundle = d3.layout.bundle();

    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.85)
        .radius(function(d) { return d.y; })
        .angle(function(d) { return d.x / 180 * Math.PI; });

    div = d3.select("body").insert("div", "h2")
        .style("top", "-80px")
        .style("left", "-160px")
        .style("width", w + "px")
        .style("height", w + "px")
        .style("position", "absolute")
        .style("-webkit-backface-visibility", "hidden");

    ////////////////////////////
    // Create the SVG Viewport
    svgContainer = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + rx + "," + ry + ")");

    svgContainer.append("svg:path")
        .attr("class", "arc")
        .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
        .on("mousedown", mousedown);

    d3.json("data/dataSample.json", function(classes) {
        var nodes = cluster.nodes(packages.root(classes)),
            links = packages.imports(nodes, classes),
            splines = bundle(links);


        var path = svgContainer.selectAll("path.link")
            .data(links)
            .enter().append("svg:path")
            .attr("class", function(d) { return "link source-" + d.source.key + " target-" + d.target.key; })
            .attr("d", function(d, i) { return line(splines[i]); });

        svgContainer.selectAll("g.node")
            .data(nodes.filter(function(n) { return !n.children; }))
            .enter().append("svg:g")
            .attr("class", "node")
            .attr("id", function(d) { return "node-" + d.key; })
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
            .append("svg:text")
            .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
            .text(function(d) { return d.key; })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        d3.select("input[type=range]").on("change", function() {
            line.tension(this.value / 100);
            path.attr("d", function(d, i) { return line(splines[i]); });
        });
    });

    d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);


/*
////////////////////////////
// Create USER information:

    d3.select("svg").append("div").attr("class","users");
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add USER circles to svgCcontainer
    var userCircles = svgContainer.selectAll("userCircle")
        .data(dataObject.users)
        .enter()
        .append("circle")
        .attr("class", "UserCircle")


    // Edit circle attributes
    var userCircleAttributes = userCircles
        .attr("cx",     function() { return xUsers; })
        .attr("cy",     function(d,i) { return (i+1)*(cRadius*2.5); })
        .attr("r",      function () { return cRadius; })
        .style("fill",  function () { return "blue" });

    // Add text elements to container
    var userText = svgContainer.selectAll("userText")
        .data(dataObject.users)
        .enter()
        .append("text");

    // Edit attributes of text elements
    var userTextLabels = userText
        .attr("x", function() { return xUsers-20; })
        .attr("y", function(d,i) { return (i+1)*(cRadius*2.5); })
        .text( function(d,i) { return dataObject.users[i].userLabelShort } )
        .attr("font-size", "12px")
        .attr("text-anchor", "end");

    if(dialog) alert("Users added");

////////////////////////////
// Create PAPER information:

    d3.select("svg").append("div").attr("class","papers");
    // Add PAPER circles to svgContainer
    var paperCircles = svgContainer.selectAll("paperCircle")
        .data(dataObject.papers)
        .enter()
        .append("circle")
        .attr("class", "PaperCircle");

    // Edit circle attributes
    var paperCircleAttributes = paperCircles
        .attr("cx",     function() { return xPapers; })
        .attr("cy",     function(d,i) { return (i+1)*(cRadius*2.5); })
        .attr("r",      function () { return cRadius; })
        .style("fill",  function () { return "red" });

    // Add text elements to container
    var paperText = svgContainer.selectAll("paperText")
        .data(dataObject.papers)
        .enter()
        .append("text");

    // Edit attributes of text elements
    var paperTextLabels = paperText
        .attr("x", function() { return xPapers+20; })
        .attr("y", function(d,i) { return (i+1)*(cRadius*2.5); })
        .text( function(d,i) { return dataObject.papers[i].paperLabel } )
        .attr("font-size", "12px")
        .attr("text-anchor", "start");

    if(dialog) alert("Papers added");


/////////////////////////
// Create RELATION lines:

    var relLine = svgContainer.selectAll("line")
        .data(dataObject.rel)
        .enter()
        .insert("line", ":first-child") // place lines in the back
        .attr("x1", xUsers)
        .attr("y1", function(d) {
            return dataObject.users.map( function(el){
                    return el.userId;
                }).indexOf(d.relUser)*(cRadius*2.5)+cRadius*2.5;
        } )
        .attr("x2", xPapers)
        .attr("y2", function(d) {
            return dataObject.papers.map( function(el){
                    return el.paperId;
                }).indexOf(d.relPaper)*(cRadius*2.5)+cRadius*2.5;
        } )
        .attr("stroke-width", 1)
        .attr("stroke", "grey");

    if(dialog) alert("Relations created");


/////////////////////////////////
// Create INTERACTIVE information:

    // Users' information boxes
    userCircles.on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .95);
            div .html( d.userLabel + "<br/>" + "User ID: " + d.userId + "<br/>" + "Date: " + d.userDate )
                .style("left", d3.mouse(this)[0] + "px")
                .style("top", d3.mouse(this)[1] + "px");
        })
        .on("mouseout", function() {
            div.transition()
                .duration(100)
                .style("opacity", 0);
        });

    // Papers' information boxes
    paperCircles.on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .95);
            div .html( d.paperLabel + "<br/>" + "Paper ID: " + d.paperId + "<br/>" + "Date: " + d.paperDate )
                .style("left", d3.mouse(this)[0] + "px")
                .style("top", d3.mouse(this)[1] + "px");
        })
        .on("mouseout", function() {
            div.transition()
                .duration(100)
                .style("opacity", 0);
        });

    if(dialog) alert("Mouseover the circles to see more information");

    */

}

//////////////////////////////////
// DATA RETRIEVAL AND DRAWING CALL
function retrieveAndDraw () {

    if(dialog) alert("The data is going to be retrieved from the JSON file");

    // Retrieve data from JSON file
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", dataFile, true);
    oReq.send();

    // When data is loaded, execute:
    function reqListener() {
        dataObject = JSON.parse(this.responseText);
        console.log("Data retrieved: " + dataObject);

        drawElements();
    }
}

/////////////
// INTERATION
function mouse(e) {
    return [e.pageX - rx, e.pageY - ry];
}

function mousedown() {
    m0 = mouse(d3.event);
    d3.event.preventDefault();
}

function mousemove() {
    if (m0) {
        var m1 = mouse(d3.event),
            dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
        div.style("-webkit-transform", "translateY(" + (ry - rx) + "px)rotateZ(" + dm + "deg)translateY(" + (rx - ry) + "px)");
    }
}

function mouseup() {
    if (m0) {
        var m1 = mouse(d3.event),
            dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

        rotate += dm;
        if (rotate > 360) rotate -= 360;
        else if (rotate < 0) rotate += 360;
        m0 = null;

        div.style("-webkit-transform", null);

        svgContainer
            .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
            .selectAll("g.node text")
            .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -8; })
            .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
    }
}

function mouseover(d) {
    svgContainer.selectAll("path.link.target-" + d.key)
        .classed("target", true)
        .each(updateNodes("source", true));

    svgContainer.selectAll("path.link.source-" + d.key)
        .classed("source", true)
        .each(updateNodes("target", true));
}

function mouseout(d) {
    svgContainer.selectAll("path.link.source-" + d.key)
        .classed("source", false)
        .each(updateNodes("target", false));

    svgContainer.selectAll("path.link.target-" + d.key)
        .classed("target", false)
        .each(updateNodes("source", false));
}

function updateNodes(name, value) {
    return function(d) {
        if (value) this.parentNode.appendChild(this);
        svgContainer.select("#node-" + d[name].key).classed(name, value);
    };
}

function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}

function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

