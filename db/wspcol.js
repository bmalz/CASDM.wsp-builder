var config = require('./config.js').Configuration;
var Connection = require("tedious").Connection;
var Request = require('tedious').Request;

this.fetch = function(callback) {
    var wspcol = [];

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
            var request = new Request("SELECT * FROM wspcol", function(error, rowCount, rows) {
                if (error) {
                    callback(error);
                    connection.close();
                }
            });

            request.on('row', function(columns) {
                var wsptbl_item = {};
                columns.forEach(function(column) {
                    wspcol_item = {};
                    if (column.value !== null) {
                        switch (column.metadata.colName) {
                            case 'id':
                                wspcol_item.id = column.value;
                                break;
                            case 'table_name':
                                wspcol_item.table_name = column.value;
                                break;
                            case 'column_name':
                                wspcol_item.column_name = column.value;
                                break;
                            case 'schema_name':
                                wspcol_item.schema_name = column.value;
                                break;
                            case 'description':
                                wspcol_item.description = column.value;
                                break;
                            case 'display_name':
                                wspcol_item.display_name = column.value;
                                break;
                            case 'type':
                                wspcol_item.type = column.value;
                                break;
                            case 'string_len':
                                wspcol_item.string_len = column.value;
                                break;
                            case 'xrel_table':
                                wspcol_item.xrel_table = column.value;
                                break;
                            case 'on_new_default':
                                wspcol_item.on_new_default = column.value;
                                break;
                            case 'is_indexed':
                                wspcol_item.is_indexed = column.value;
                                break;
                            case 'is_unique':
                                wspcol_item.is_unique = column.value;
                                break;
                            case 'is_required':
                                wspcol_item.is_required = column.value;
                                break;
                            default:
                                break;
                        }
                    }
                });

                wspcol.push(wspcol_item);
            });

            request.on('doneInProc', function(rowCount, more) {
                callback(wspcol);
            });

            connection.execSql(request);
        }
    });

    connection.on('end', function() {
        connection.close();
    });
};