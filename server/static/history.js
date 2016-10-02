var socket = io();
socket.on('new_http', function (data) {
    eventHandler(data);
    console.log(historyList)
});


var historyList = {"test":[]};


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
        ReactDOM.render(
          <Hello data={historyList}/>,
          document.getElementById('example')
        );

    }
    console.log(historyList)
}

var Hello = React.createClass({
    render: function() {
        var names = Object.keys(this.props.data);
        var data = this.props.data;
        return (
            <ul>

                {names.map(function(name, index){
                    return(
                            <HistoryList key= {index} data={data[name]} />
                            );
                  })}
            </ul>
        )
    }
});

var HistoryList = React.createClass({
    render: function() {
        var names = this.props.data;
        console.log(names)
        return (
            <ul>
                {names.map(function(name, index){
                    return <li key={ index }>{name.host}{name.uri} - {name.ts}</li>;
                  })}
            </ul>
        )
    }

})

ReactDOM.render(
  <Hello data={historyList}/>,
  document.getElementById('example')
);
