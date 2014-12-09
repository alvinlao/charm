var server = require('./server/server');
var PORT_NUMBER = 3000;

server.start(process.env.PORT || PORT_NUMBER);

require("./server/socket");