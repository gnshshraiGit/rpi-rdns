var http = require('http');
var url = require('url');
var port = process.env.port || 1337;

var IPMaps = {};

http.createServer(function (req, res) {
    var requestUrl = url.parse(req.url);
    switch (requestUrl.pathname.toLowerCase()) {
        case '/update':
            var appName = url.parse(req.url, true).query["app"];
            var port = url.parse(req.url, true).query["port"];
            IPMaps[appName] = {};
            IPMaps[appName].IP = getClientAddress(req);
            IPMaps[appName].port = port
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(IPMaps));
            break;
        case '/play':
            var appName = url.parse(req.url, true).query["app"];
            res.writeHead(302, { 'Location': 'http://' + IPMaps[appName].IP + ':' + IPMaps[appName].port });
            break;
    }
    res.end();
}).listen(port);

var getClientAddress = function (req) {
    var ip = (req.headers['x-forwarded-for'] || '').split(',')[0]
        || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7);
    }
    return ip;
};