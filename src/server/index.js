"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
var browserify_middleware_1 = __importDefault(require("browserify-middleware"));
var express_ws_1 = __importDefault(require("express-ws"));
var _a = (0, express_ws_1["default"])((0, express_1["default"])()), app = _a.app, getWss = _a.getWss, applyTo = _a.applyTo;
var port = 8080;
app.use('/index.js', (0, browserify_middleware_1["default"])("./dist/app/index.js"));
app.get('/', function (req, res) {
    console.log("index");
    res.sendFile((0, path_1.resolve)(__dirname, "../dist/index.html"));
});
app.ws('/', function (ws, req) {
    ws.on('message', function (msg) {
        console.log(msg);
    });
    console.log('socket', req);
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
