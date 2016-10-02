var socket = io();
socket.on('new_http', function (data) {
    data = JSON.parse(data);
    update({name: data.host});
});



var height = 650,
    width = 1000,
    format = d3.format(",d"),
    color = d3.scale.category20b();


var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(10);

var svg = d3.select("#bubbles").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
    var classes = [];

    function recurse(name, node) {
        if (node.children) node.children.forEach(function (child) {
            recurse(node.name, child);
        });
        else classes.push({
            packageName: name,
            className: node.name,
            value: node.size
        });
    }

    recurse(null, root);
    return {
        children: classes
    };
}

var indexes = {};
var host_data = {children: []};
var root = host_data;
var node = svg.selectAll(".node");


function update(new_data) {
    if(indexes[new_data.name] != undefined) {
        host_data.children[indexes[new_data.name]].size++;
    }
    else {
        indexes[new_data.name] = host_data.children.length;
        host_data.children.push({name: new_data.name, size: 1});
    }
    console.log(host_data);

    root = host_data;

    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root)).filter(function (d){return !d.children;}));
    node.select('text')
        .text(function(d) {console.log(d); return d.className.substring(0, d.r / 3) + " " + format(d.value); });

    // capture the enter selection
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // re-use enter selection for circles
    nodeEnter
        .append("circle")
        .attr("r", function (d) {console.log(d); return d.r;})
        .style("fill", function (d, i) {return color(i);});
    nodeEnter
        .append("title")
        .text(function (d) {
            console.log(d);
            return d.className + ": " + format(d.value);
        });
    nodeEnter.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) {console.log(d); return d.className.substring(0, d.r / 3) + " " + format(d.value); })
        .style({
            "fill":"black",
            "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
            "font-size": "15px"
        });

    node.select("circle")
        .transition().duration(100)
        .attr("r", function (d) {
            return d.r;
        })
    .style("fill", function (d, i) {
        return color(i);
    });

    node.transition().attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.exit().remove();

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    }

}
d3.select(self.frameElement).style("height", height + "px");
