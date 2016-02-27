/**
 * Created by Lucas Parzianello on 2/27/16.
 */

// PARAMETERS:
var dataObject;
var dialog = true;
var dataFile = "data/data.json";
var xUsers=280, xPapers=880;
var width = $(window).width();
var height = $(window).height();
var cRadius = 8;


// ELEMENT DRAWING:
function drawElements () {
    // Execute when data is loaded
    console.log(dataObject);

    ////////////////////////////
    // Create the SVG Viewport
    var svgContainer = d3.select("body").append("svg")
        .attr("width", width*0.9)
        .attr("height", cRadius*470);


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

}


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

