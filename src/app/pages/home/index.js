import "./global.css";
import test from "../../lib/test";
function afterPageIsReady(fn) {
    if (document.readyState != 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
afterPageIsReady(function () {
    document.querySelector("#videoElem");
    var websocket = new WebSocket('ws://localhost:8080');
    websocket.onopen = function () {
        websocket.send("ping");
    };
    console.log(test.value);
});
//# sourceMappingURL=index.js.map