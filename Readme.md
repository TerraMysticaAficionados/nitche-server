
### Installation
```
# clone repo and cd into it.
npm i # install dependencies
```

### Build Frontend
```
webpack
# or webpack --watch
```

### Build Server
```
tsc -p tsconfig.server.json
# or just run
npm run build-server
# or for continuous (still need to restart server manually)
npm run watch-server
```
### start server
```
node ./dist/server/index.js
# or 
npm run start
```

### Notes on build strategy
Currently build strategy is only tested in development.
#### type:module
in package.json we set the field "type":"module" to instruct node that this package is using es6 imports.
#### pages
the concept of a "page" is essentially a contained SPA served as an html file and a bundle containing css, js, etc. Pages are compiled from /src/app/pages to /dist/app and served using express.static
- I would prefer serving these pages from express, however doing so introduces a sticky situation where the server ts compilation of /src/server imports assets from the front-end /src/app. However recall these are not the actual source files, which and bundled by webpack.

