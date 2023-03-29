import "./global.css"

type StartupFunction = () => void

function afterPageIsReady(fn: StartupFunction) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

afterPageIsReady(function() {
    document.querySelector("#videoElem")
    const websocket = new WebSocket('ws://localhost:8080')
    websocket.onopen = function() {
        websocket.send("ping")
    }
    
})