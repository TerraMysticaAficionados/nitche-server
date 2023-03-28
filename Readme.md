

### Build Frontend
```
webpack
# or webpack --watch
```

### Build Server
```
tsc src/server/index.ts --esModuleInterop --outDir ./dist/server
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
