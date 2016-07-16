var wspcol = require('./wspcol');
var wsptbl = require('./wsptbl');

wspcol.fetch(function(data) {
    if(typeof data == 'string') {
        console.error(data);
    } else {
        console.log(data.length);
    }
});

wsptbl.fetch(function(data) {
    if(typeof data == 'string') {
        console.error(data);
    } else {
        console.log(data.length);
    }
});