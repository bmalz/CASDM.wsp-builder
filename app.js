var config = {
    mssql: {
        userName: "sa",
        password: "",
        server: "172.26.46.182",
        database: "mdb"
    }
};

var Connection = require("tedious").Connection;
var connection = new Connection({
    userName: config.mssql.userName,
    password: config.mssql.password,
    server: config.mssql.server,
    options: {
        database: config.mssql.database
    }
});

var events = require('events');
var eventEmitter = new events.EventEmitter();

eventEmitter.on('db_connection', function(connection) {
    connection.on("connect", function(error) {
        if (error) {
            return console.error(error);
        } else {
            console.log('Connected to ' + config.mssql.database + '!');
            eventEmitter.emit('db_select_wsptbl', connection);
        }
    });
});

eventEmitter.on('db_select_wsptbl', function(connection) {
    var Request = require('tedious').Request;

    var request = new Request("SELECT * FROM wsptbl", function(error) {
        if(error) {
            console.error(error);
        }
    });

    var result = '';
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if(column.value !== null) {
                result += column.metadata.colName + ": " + column.value + "\r\n";
            }
        }, this);

        console.log(result);
        result = '';
    });
    request.on('done', function(rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
});

eventEmitter.emit('db_connection', connection);