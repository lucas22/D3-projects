/**
 * Created by Lucas Parzianello on 2/22/16.
 */

var dataObject;
var dialog = false;

// Shows data retrieved
function drawElements () {
    // Execute when data is loaded
    console.log(dataObject);

    ////////////////////////////
    // Create the SVG Viewport
    var width = $(window).width();
    var height = $(window).height();

    var svgContainer = d3.select("body").append("svg")
        .attr("width", width*0.9)
        .attr("height", 3700);


    ////////////////////////////
    // Create USER information:

    var xUsers=280, xPapers=880;

    d3.select("svg").append("div").attr("class","users");
    // Add USER circles to svgCcontainer
    var userCircles = svgContainer.selectAll("userCircle")
        .data(dataObject.users)
        .enter()
        .append("circle")
        .attr("class", "UserCircle");

    // Edit circle attributes
    var userCircleAttributes = userCircles
        .attr("cx",     function() { return xUsers; })
        .attr("cy",     function(d,i) { return i*20+10; })
        .attr("r",      function () { return 8; })
        .style("fill",  function () { return "blue" });

    // Add text elements to container
    var userText = svgContainer.selectAll("userText")
        .data(dataObject.users)
        .enter()
        .append("text");

    // Edit attributes of text elements
    var userTextLabels = userText
        .attr("x", function() { return xUsers-20; })
        .attr("y", function(d,i) { return i*20+13; })
        .text( function(d,i) { return dataObject.users[i].userLabel } )
        .attr("font-size", "12px")
        .attr("text-anchor", "end");


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
        .attr("cy",     function(d,i) { return i*20+10; })
        .attr("r",      function () { return 8; })
        .style("fill",  function () { return "red" });

    // Add text elements to container
    var paperText = svgContainer.selectAll("paperText")
        .data(dataObject.papers)
        .enter()
        .append("text");

    // Edit attributes of text elements
    var paperTextLabels = paperText
        .attr("x", function() { return xPapers+20; })
        .attr("y", function(d,i) { return i*20+13; })
        .text( function(d,i) { return dataObject.papers[i].paperLabel } )
        .attr("font-size", "12px")
        .attr("text-anchor", "start");


    ////////////////////////////
    // Create RELATION lines:

    var relLine = svgContainer.selectAll("line")
        .data(dataObject.rel)
        .enter()
        .append("line")
            .attr("x1", xUsers)
            .attr("y1", function(d) {
                return dataObject.users.map( function(el){
                    return el.userId;
                }).indexOf(d.relUser)*20+10;
            } )
            .attr("x2", xPapers)
            .attr("y2", function(d) {
                return dataObject.papers.map( function(el){
                    return el.paperId;
                }).indexOf(d.relPaper)*20+10;
            } )
            .attr("stroke-width", 1)
            .attr("stroke", "grey");

}

// Retrieve the data from file and call drawing function
function retrieveAndDraw () {

    var dataFile = "data/data.json";

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
