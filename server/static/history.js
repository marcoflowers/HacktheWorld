var socket = io();
socket.on('new_http', function (data) {
    eventHandler(data);
    console.log(historyList)
});


var historyList = {"23:45:f4:23:3d":[{"host":"test.com", "uri":"/", "ts":12345, "mac":"23:45:f4:23:3d"}, {"host":"test2.com", "uri":"/adrian", "ts":12345, "mac":"23:45:f4:23:3d"}, {"host":"fds.com", "uri":"/adrian", "ts":12345, "mac":"23:45:f4:23:3d"}],"23:45:t4:23:3d":[{"host":"test.com", "uri":"/", "ts":12345, "mac":"23:45:f4:23:3d"}, {"host":"sfd.com", "uri":"/adrian", "ts":12345, "mac":"23:45:f4:23:3d"}, {"host":"sdf.com", "uri":"/adrian", "ts":12345, "mac":"23:45:f4:23:3d"}]};


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
        var name = this.props.item;
        return (
            <div>
                <HistoryItem mac={name} data={data[name]} />
            </div>
            
        )
    }
});

var List = React.createClass({
    handleClick: function(name) {
        console.log("test")
        console.log(name)
        ReactDOM.render(
  <Hello data={historyList} item={name}/>,
  document.getElementById('example2')
);
ReactDOM.render(
  <List data={historyList} item={name}/>,
  document.getElementById('example')
);

  },
    render: function() {
        var names = Object.keys(this.props.data);
        var data = this.props.data;
        var item = this.props.item;
        return (
            <ul className="list-group">
            
                {Object.keys(this.props.data).map(function(name, index){
                    var boundClick = this.handleClick.bind(this, name);
                    return(
                        <ListItem handleClick={this.handleClick} onClick={this.handleClick} key={index}  data={name} item={item}/>
                        );
                  }, this)}
            </ul>
            
        )
    }
})

var ListItem = React.createClass({
    render: function() {
        var boundClick = this.props.handleClick.bind(this, this.props.data);
        var item = this.props.item;
        var classn = "list-group-item";
        if(this.props.data == this.props.item){
            classn = "list-group-item active"
        }
        return (
            <div>
                <a href="#" onClick={boundClick}><li className={classn}>{this.props.data}</li></a>
            </div>
        )
    }

})


var HistoryItem = React.createClass({
    render: function() {
        var urlList = this.props.data;
        var mac = this.props.mac
        var length = urlList.length;
        return (
            <ul>
                <table className="table">
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Hostname</th>
                </tr>
                </thead>
                <tbody>
                {urlList.map(function(urlitem, index){
                    return <tr key={ index }><td>{urlitem.ts}</td><td>{urlitem.host}{urlitem.uri}</td></tr>;
                  })}
                </tbody>
                </table>
            </ul>
        )
    }

})

ReactDOM.render(
  <Hello data={historyList} item="23:45:f4:23:3d"/>,
  document.getElementById('example2')
);

ReactDOM.render(
  <List data={historyList} item=""/>,
  document.getElementById('example')
);
