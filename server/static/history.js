var socket = io();
socket.on('new_http', function (data) {
    eventHandler(data);
    console.log(historyList)
});


var historyList = {};


function eventHandler(data)
{
    data = JSON.parse(data)
    console.log(data)
    if(data["referred"] != true)
    {
        console.log(data)
        console.log(data["referred"])
        var mac = data["mac"]
        console.log(mac)
        if(mac in historyList)
        {
           historyList[mac].push(data)
        }
        else
        {
            historyList[mac] = [data]
        }
    }
    console.log(historyList)
}
