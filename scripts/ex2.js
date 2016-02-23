/**
 * Created by Lucas Parzianello on 2/14/16.
 */

// Creates 3 colored circles using D3 and a JSON file w/ data
function circlesD3 () {

    var jsonCircles;

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "scripts/circles.json", true);
    oReq.send();

    function reqListener(e) {
        jsonCircles = JSON.parse(this.responseText);

        console.log(jsonCircles);

        var bodySelection = d3.select("body");

        var svgContainer = d3.select("body").append("svg")
            .attr("width", 800)
            .attr("height", 400);

        var circles = svgContainer.selectAll("circle")
            .data(jsonCircles)
            .enter()
            .append("circle");

        var circleAttributes = circles
            .attr("cx", function(d, i) {return jsonCircles[i].x_axis})
            .attr("cy", function(d,i) {return jsonCircles[i].y_axis})
            .attr("r", function (d,i) { return jsonCircles[i].radius})
            .style("fill", function (d,i) {return jsonCircles[i].color});
    }
}

// Shows data retrieved
function dataListD3 () {

    var dataSample, dialog = false;

    if(dialog) alert("The data is going to be retrieved from the JSON file");

    // Retrieve data from JSON file
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "data/data.json", true);
    oReq.send();

    // When data is loaded, execute:
    function reqListener(e) {

        dataSample = JSON.parse(this.responseText);

        console.log(dataSample);

        // Create HTML elements and list the information
        d3.select("body").append("div").attr("class","users");
        d3.select("div.users").append("h1").text("Users:");
        d3.select("div.users").append("ul").attr("id","users_list");
        var users = d3.select("body").select("ul#users_list").selectAll("div.users")
            .data(dataSample.users)
            .enter()
            .append("li")
            .attr("class", "user_item")
            .text( function (d, i) { return dataSample.users[i].userLabel; } );


        if(dialog) alert("List elements were created to show the users");

        d3.select("body").append("div").attr("class","papers");
        d3.select("div.papers").append("h1").text("Papers:");
        d3.select("div.papers").append("ul").attr("id","papers_list");
        var papers = d3.select("body").select("ul#papers_list").selectAll("div.papers")
            .data(dataSample.papers)
            .enter()
            .append("li")
            .attr("class", "paper_item")
            .text( function (d, i) { return dataSample.papers[i].paperLabel; } );

        if(dialog) alert("The same happens to the papers");
    }
}

// Shows relations of the data retrieved
function relListD3 () {

    var dataSample, dialog = false;

    if(dialog) alert("The data is going to be retrieved from the JSON file");

    // Retrieve data from JSON file
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "data/data.json", true);
    oReq.send();

    // When data is loaded, execute:
    function reqListener(e) {

        dataSample = JSON.parse(this.responseText);

        console.log(dataSample);

        // Create HTML elements and list the information
        d3.select("body").append("div").attr("class","Relations");
        d3.select("div.Relations").append("h1").text("Relations:");
        d3.select("div.Relations").append("ul").attr("id","relations_list");
        var users = d3.select("body").select("ul#relations_list").selectAll("div.users")
            .data(dataSample.rel)
            .enter()
            .append("li")
            .attr("class", "relation_item")
            .text( function (d, i) { return dataSample.rel[i].relPaper + " " + dataSample.rel[i].relUser + " " + dataSample.rel[i].relTime; } );

    }
}
