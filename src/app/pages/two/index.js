function afterPageIsReady(fn) {
    if (document.readyState != 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
afterPageIsReady(function () {
    var root = document.querySelector("#root");
    if (root != null) {
        root.textContent = "TWO";
    }
});
export {};
//# sourceMappingURL=index.js.map