var socket = io();
socket.on('new_http', function (data) {
    console.log("hello")
    console.log(data);
    var theDiv = document.getElementById("getMess");
        theDiv.innerHTML += data; 
    eventHandler(data);
});

socket.on('client_num_update', function (data) {
    console.log("Clients connected"+ data);
    document.getElementById("clientCount").innerHTML = "Client count: "+data;
});

socket.on('mesh_num_update', function (data) {
    console.log("Mesh Nodes connected"+ data);
    document.getElementById("nodeCount").innerHTML = "Mesh Node count: "+data;
});

var historyMap = {};


function eventHandler(data)
{

}
