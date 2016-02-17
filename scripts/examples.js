/* EXAMPLE 1: */
var theData = [ 1, 2, 4, 8, 16 ]

var p = d3.select("body").selectAll("p")
  .data(theData)
  .enter()
  .append("p")
  .text( function (d, i) { return "index: "+i+" value: "+d; } );

////////////////
/* EXAMPLE 2: */
var circleRadius = [50];
var bodySelection = d3.select("body");

var svgContainer = d3.select("body").append("svg")
                                  .attr("width", 800)
                                  .attr("height", 400);

var circles = svgContainer.selectAll("circle")
                         .data(circleRadius)
                         .enter()
                         .append("circle");

var circleAttributes = circles
                     .attr("cx", 50)
                     .attr("cy", 50)
                     .attr("r", circleRadius)
                     .style("fill", "blue");

////////////////
/* EXAMPLE 3: */
var circleRadii = [16, 32, 64, 128];
var colors = ["red", "green", "blue", "purple"];

var bodySelection = d3.select("body");

var svgContainer = d3.select("body").append("svg")
                                 .attr("width", 800)
                                 .attr("height", 400);

var circles = svgContainer.selectAll("circle")
                        .data(circleRadii)
                        .enter()
                        .append("circle");

var circleAttributes = circles
                    .attr("cx", function(d, i) {return (i+1)*100+d})
                    .attr("cy", function(d) {return 300-d})
                    .attr("r", function (d) { return d; })
                    .style("fill", function (d,i) {return colors[i]});

////////////////
/* EXAMPLE 4: */
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



var svgSelection = bodySelection.append("svg")
                                .attr("width", 50)
                                .attr("height", 50);

var circleSelection = svgSelection.append("circle")
                                  .attr("cx", 25)
                                  .attr("cy", 25)
                                  .attr("r", function (d) { return d; })
                                  .style("fill", "purple");
