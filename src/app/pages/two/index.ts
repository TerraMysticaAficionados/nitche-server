import test from "../../lib/test"

type StartupFunction = () => void

function afterPageIsReady(fn: StartupFunction) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

afterPageIsReady(function() {
    let root = document.querySelector("#root")
    if(root != null) {
        root.textContent = "TWO"
    }
})