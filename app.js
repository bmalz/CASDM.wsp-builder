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

connection.on("connect", function(error) {
    if(error) {
        return console.error(error);
    } else {
        console.log('Connected to ' + config.mssql.database + '!');
    }
});