import express from "express";
import { resolve } from "path";
import expressWs from 'express-ws'
import fs from "fs/promises"
import {PassThrough} from "stream"
import {path as ffmpegPath} from "@ffmpeg-installer/ffmpeg"
import ffmpeg from "fluent-ffmpeg"
ffmpeg.setFfmpegPath(ffmpegPath);
import cors from "cors"
import WebRtcConnectionManager from "./connections/webrtcconnectionmanager.js"
import { mount }  from './rest/connectionsapi.js';
import { fileURLToPath } from 'url';
import path from "path"
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { app, getWss, applyTo } = expressWs(express(),null,{
  wsOptions: {
    perMessageDeflate: false
  }
});
const port = 8080;

app.use(cors({
  origin: "*",//'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: "GET,POST"
}))
app.use(express.json())

//  webpacked pages available
app.use("/",express.static(resolve(__dirname,"../../dist/app")))

//  recordings available skipping cors
app.use("/recordings",cors(), express.static(resolve(__dirname,"../../recordings")))

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname,"../app/home/index.html"));
});
// @TODO better bundle serving
app.get("/bundle.js", (req, res) => {
  res.sendFile(resolve(__dirname,"../app/home/bundle.js"))
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
    await fs.rm("./recordings/"+req.params.id, {
      "recursive":true
    })
    await fs.mkdir("./recordings/"+req.params.id, {
      recursive: true
    })
  } catch(error) {
    if(error.code == 'EEXIST') {
      console.log("found previous stream", req.params.id)
    } else {
      console.log(error)  
    }
  }
  
  try {
  //  https://www.geeksforgeeks.org/node-js-fs-open-method/
    let istream = new PassThrough()
    let recorder:any = null
    ws.on('message', function(data:Buffer) {
      istream.push(Buffer.from(new Uint8Array(data)));
      if(!recorder) {
        let recordingPath = `./recordings/${req.params.id}/manifest.mpd`
        recorder = ffmpeg().addInput(istream).addInputOptions([
          '-re',
        ]).addOutputOption([
          '-f', 'dash'
        ])
        .on('start', ()=>{
          console.log('Start recording >> ', recordingPath)
        })
        .on('end', ()=>{
          console.log('Stop recording >> ', recordingPath)
        })
        .output(recordingPath)
        recorder.run()
      }
    });
    ws.on("close", () => {
      console.log("stream closed");

      if(recorder) istream.end()
    })
  } catch(error) {
    console.log(error)
  }
})


import recordAudioVideoStream from './recordAudioVideoStream.js'
const connectionManager = WebRtcConnectionManager.create(recordAudioVideoStream);
mount(app, connectionManager, `/webrtc-prototype`);


app.listen(port, () => {
  console.log(`Socket server listening on port ${port}`)
});
