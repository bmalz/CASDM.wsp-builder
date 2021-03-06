var config = {
    mssql: {
        userName: "sa",
        password: "",
        server: "172.26.46.182",
        database: "mdb"
    }
};
var Connection = require("tedious").Connection;
var events = require("events");
var eventEmitter = new events.EventEmitter();

eventEmitter.on('db_connection', function() {
    var connection1 = new Connection({
        userName: config.mssql.userName,
        password: config.mssql.password,
        server: config.mssql.server,
        options: {
            database: config.mssql.database
        }
    });

    connection1.on("connect", function(error) {
        if (error) {
            return console.error(error);
        } else {
            console.log('Connected to ' + config.mssql.database + '!');
            eventEmitter.emit('db_select_wsptbl', connection1);
        }
    });
});

eventEmitter.on('db_select_wsptbl', function(connection) {
    var Request = require('tedious').Request;

    var request = new Request("SELECT * FROM wsptbl", function(error) {
        if (error) {
            console.error(error);
        }
    });

    var wsptbl = [];
    request.on('row', function(columns) {
        var wsptbl_item = {};
        columns.forEach(function(column) {
            if (column.value !== null) {
                switch (column.metadata.colName) {
                    case 'id':
                        wsptbl_item.id = column.value;
                        break;
                    case 'table_name':
                        wsptbl_item.table_name = column.value;
                        break;
                    case 'schema_name':
                        wsptbl_item.schema_name = column.value;
                        break;
                    case 'description':
                        wsptbl_item.description = column.value;
                        break;
                    case 'display_name':
                        wsptbl_item.display_name = column.value;
                        break;
                    case 'function_group':
                        wsptbl_item.function_group = column.value;
                        break;
                    case 'rel_attr':
                        wsptbl_item.rel_attr = column.value;
                        break;
                    case 'common_name':
                        wsptbl_item.common_name = column.value;
                        break;
                    default:
                        break;
                }
            }
        }, this);

        wsptbl.push(wsptbl_item);
        console.log("wsptbl " + wsptbl_item.id);
    });
    request.on('doneInProc', function(rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
});

eventEmitter.emit('db_connection');