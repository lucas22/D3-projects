/**
 * Created by Lucas Parzianello on 2/27/16.
 */
mainDraw = function() {
    var importsThreshold = $("#uThres").val();

    var w = 800,
        h = 800,
        rx = w / 2,
        ry = h / 2,
        m0,
        rotate = 0;

    var splines = [];
    var nodes, links;

    var cluster = d3.layout.cluster()
        .size([360, ry - 120])
        .sort(function (a, b) {
            return d3.ascending(a.key, b.key);
        });

    var bundle = d3.layout.bundle();

    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.85)
        .radius(function (d) {
            return d.y;
        })
        .angle(function (d) {
            return d.x / 180 * Math.PI;
        });

    d3.select(".Views").remove();
    var div = d3.select("body").insert("div").attr("class", "Views")
        .style("top", 0)
        .style("left", 0)
        .style("width", w + "px")
        .style("height", h + "px")
        .style("position", "absolute")
        .style("-webkit-backface-visibility", "hidden");

    var svg = div.append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + rx + "," + ry + ")");

    svg.append("svg:path")
        .attr("class", "arc")
        .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
        .on("mousedown", mousedown);

    d3.json("data/data.json", function (classes) {
        var topUsers = [];
        var bossDict = {};

        // add elements that are cluster names (bosses)
        for (c in classes) {
            var cat = classes[c].name.split(".")[0];
            var cl = classes[c].name.split(".")[1];
            var type = classes[c].name.split(".")[2];
            var boss = [cat, cl, type, cl].join(".");

            if (!bossDict[boss]) {
                for (c in classes) {
                    if (classes[c].name == boss) {
                        bossDict[boss] = classes[c];
                        topUsers.push(bossDict[boss]);
                        break;
                    }
                }
            }
        }
        // add users that are within the threshold
        for (c in classes) {
            var cat = classes[c].name.split(".")[0];
            if (cat == "user" && classes[c].imports.length >= importsThreshold) {
                topUsers.push(classes[c]);
            }
        }
        var nUsers = topUsers.length;
        for (u in topUsers){
            console.log(topUsers[u]);
        }
        console.log(topUsers.length);
        // add for each paper in imports to topUsers
        var topUsers2 = topUsers;
        for (t in topUsers) {
            for (i in topUsers[t].imports) {
                for (c in classes) {
                    if (/*topUsers.indexOf(classes[c])==-1 &&*/ classes[c].name == topUsers[t].imports[i]) {
                        newItem = classes[c];
                        newItem.imports = []; // remove imports of papers (no extra users)
                        topUsers2.push(newItem);
                    }
                }
            }
        }

        var nPapers = topUsers2.length - nUsers;

        nodes = cluster.nodes(packages.root(topUsers2));
        links = packages.imports(nodes);
        splines = bundle(links);

        var path = svg.selectAll("path.link")
            .data(links)
            .enter().append("svg:path")
            .attr("class", function (d) {
                return "link source-" + d.source.key + " target-" + d.target.key;
            })
            .attr("d", function (d, i) {
                return line(splines[i]);
            });

        svg.selectAll("g.node")
            .data(nodes.filter(function (n) {
                return !n.children;
            }))
            .enter().append("svg:g")
            .attr("class", "node")
            .attr("id", function (d) {
                return "node-" + d.key;
            })
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
            })
            .append("svg:text")
            .attr("dx", function (d) {
                return d.x < 180 ? 8 : -8;
            })
            .attr("dy", ".31em")
            .attr("text-anchor", function (d) {
                return d.x < 180 ? "start" : "end";
            })
            .attr("transform", function (d) {
                return d.x < 180 ? null : "rotate(180)";
            })
            .text(function (d) {
                return d.data.labelShort;
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        stats = {
            nUsers: nUsers,
            nPapers: nPapers
        };
        drawStats(stats);

        // Controls interactivity
        d3.select("input[id=tension]").on("input", tensionUpdate);
        d3.select("input[id=uThres]").on("change", uThresUpdate);

        function tensionUpdate() {
            $('#tensionL').text(" "+$(this).val());
            line.tension(this.value / 100);
            path.attr("d", function (d, i) {
                return line(splines[i]);
            });
        }
        function uThresUpdate() {
            $('#uThresL').text($(this).val());
            mainDraw();
        }
        function drawStats(stats) {
            var msg = "Number of users: " + stats.nUsers + "<br>Number of papers: "+ stats.nPapers;
            $('#stats_text').append(msg);
        }
    });

    d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    // SVG interactivity:
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

            svg
                .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
                .selectAll("g.node text")
                .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -8; })
                .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
                .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
        }
    }
    function mouseover(d) {
        svg.selectAll("path.link.target-" + d.key)
            .classed("target", true)
            .each(updateNodes("source", true));

        svg.selectAll("path.link.source-" + d.key)
            .classed("source", true)
            .each(updateNodes("target", true));
    }
    function mouseout(d) {

        svg.selectAll("path.link.source-" + d.key)
            .classed("source", false)
            .each(updateNodes("target", false));

        svg.selectAll("path.link.target-" + d.key)
            .classed("target", false)
            .each(updateNodes("source", false));

    }
    function updateNodes(name, value) {
        return function(d) {
            if (value) this.parentNode.appendChild(this);
            svg.select("#node-" + d[name].key).classed(name, value);
        };
    }
    function cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
};