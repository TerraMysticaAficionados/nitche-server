import express from "express";
import { resolve } from "path";
import browserify from "browserify-middleware";
import expressWs from 'express-ws'

const { app, getWss, applyTo } = expressWs(express());
const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname,"../app/index.html"));
});
app.get("/bundle.js", (req, res) => {
  res.sendFile(resolve(__dirname,"../app/bundle.js"))
})

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});