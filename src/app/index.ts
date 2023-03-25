import "./index.css"
import path from 'path'
import _ from 'lodash'

console.log("hello world!")
document.onload = () => {
    console.log("onload")
    function component() {
        const element = document.createElement('div');
        
        // Lodash, now imported by this script
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        element.classList.add('hello');
    
        return element;
    }
    
    document.body.appendChild(component());
}
