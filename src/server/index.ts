import express from "express";
import { resolve } from "path";
import browserify from "browserify-middleware";
import expressWs from 'express-ws'
// const websocketStream = require('websocket-stream/stream');
import fs from "fs/promises"
import {Readable} from "stream"
import fsClassic from "fs"


const { app, getWss, applyTo } = expressWs(express(),null,{
  wsOptions: {
    perMessageDeflate: false
  }
});
const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname,"../app/index.html"));
});
// @TODO better bundle serving
app.get("/bundle.js", (req, res) => {
  res.sendFile(resolve(__dirname,"../app/bundle.js"))
})

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req);
});

app.ws("/socket-prototype/:id", async (ws, req) => {
  console.log('socket-prototype ping', req.params.id);
  try {
  //  https://www.geeksforgeeks.org/node-js-fs-open-method/
    let fstream = await (await fs.open(`./recordings/${req.params.id}.webm`, "w")).createWriteStream()
    ws.on('message', function(msg:Buffer) {
      fstream.write(Buffer.from(new Uint8Array(msg)));
    });
    ws.on("close", () => {
      console.log("stream closed");
      fstream.close()
    })
  } catch(error) {
    console.log(error)
  }
})

app.listen(port, () => {
  console.log(`Socket server listening on port ${port}`)
});
