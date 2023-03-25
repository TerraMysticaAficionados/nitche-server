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

    console.log("loaded")

})