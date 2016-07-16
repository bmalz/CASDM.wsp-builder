var config = require('./config.js').Configuration;
var Connection = require("tedious").Connection;
var Request = require('tedious').Request;

this.fetch = function(callback) {
    var wsptbl = [];

    var connection = new Connection({
        userName: config.mssql.userName,
        password: config.mssql.password,
        server: config.mssql.server,
        options: {
            database: config.mssql.database
        }
    });

    connection.on("connect", function(error) {
        if (error) {
            callback(error);
        } else {
            var request = new Request("SELECT * FROM wsptbl", function(error, rowCount, rows) {
                if (error) {
                    callback(error);
                    connection.close();
                }
            });

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
                });

                wsptbl.push(wsptbl_item);
            });

            request.on('doneInProc', function(rowCount, more) {
                callback(wsptbl);
            });

            connection.execSql(request);
        }
    });

    connection.on('end', function() {
        connection.close();
    });
};