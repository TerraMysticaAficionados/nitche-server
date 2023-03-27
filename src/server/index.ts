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

app.ws("/stream/:id", async (ws, req) => {
  console.log('stream ping', req.params.id);
  try {
    
    let webmBuffers:Buffer[] = []
    let fstream = await (await fs.open(`${req.params.id}.webm`, "w")).createWriteStream()
    ws.on('message', function(msg:Buffer) {
      // console.log("msg",msg)
      fstream.write(Buffer.from(new Uint8Array(msg)));
      // webmBuffers.push(msg)
      // webmBuffers.push(msg)
      // console.log(`opened ${req.params.id}.webm`)
      // let fstream = fp.createWriteStream()
      // fstream.write(msg)
      // fstream.close()
    });
    ws.on("close", () => {
      console.log("stream closed");
      fstream.close()
      // let fp = await fs.open(`${req.params.id}-1.webm`, "w")
      // const dataBlob = new Blob(webmBuffers, {type:'video/webm; codecs=opus'})
      // const buffer = Buffer.from(await dataBlob.arrayBuffer());
      // const readStream = Readable.from(buffer);
      // readStream.pipe(fp.createWriteStream()).on('finish', () => {
      //    console.log('🎵 audio saved');
      // });
      
      // const vid = document.createElement("video");
      // const vidURL = window.URL.createObjectURL(dataBlob);
      // vid.src = vidURL
      // vid.click()
  
      // console.log("close", webmBuffers.length)
      // console.log(buffer)
      // const webmReadable = new Readable();
      // webmReadable._read = () => {  };
      // webmBuffers.forEach(chunk => {
      //     webmReadable.push(chunk);
      // });
      // webmReadable.push(null);
      // webmReadable.pipe(fp.createWriteStream());
    })
  } catch(error) {
    console.log(error)
  }
  //  https://www.geeksforgeeks.org/node-js-fs-open-method/
  
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});