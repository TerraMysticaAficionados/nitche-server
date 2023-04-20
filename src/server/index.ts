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

import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
const envSettings = dotenv.config({
  "path": path.resolve(process.cwd(), '.env.dev')
})
dotenvExpand.expand(envSettings)  //  dotenvExpand allows .env to use system variables and self referential variables

const { app, getWss, applyTo } = expressWs(express(),undefined,{
  wsOptions: {
    perMessageDeflate: false
  }
});

const port = process.env.NITCHE_SERVER_PORT || 3000;

app.use(cors({
  origin: "*",//'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: "GET,POST"
}))
app.use(express.json())
app.use((req,res, next) => {
  console.log(req.method, req.url)
  return next()
})

if(process.env.SERVE_APP) {
  //  webpacked pages available
  app.use("/",express.static(resolve(__dirname,"../../dist/app")))
}

//  basic websocket 
app.ws('/ping', function(ws, req) {
  console.log('ping', req);
  ws.on('message', function(msg) {
    ws.send('pong')
  });
});

//  Socket to DASH
//  DASH recordings available skipping cors
app.use("/recordings",cors(), express.static(resolve(__dirname,"../../recordings")))
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
      if(recorder) istream.end()
    })
  } catch(error) {
    console.log(error)
  }
})

//  WebRTC streaming

//  WebRTC -> MP4
import { beforeOffer as recordAudioVideoStreamSetup } from './webrtc/recordAudioVideoStream.js'
const recordAVConnectionManager = WebRtcConnectionManager.create({
  beforeOffer: recordAudioVideoStreamSetup
});
mount(app, recordAVConnectionManager, `/webrtc-prototype`);

//  client WebRTC -> server WebRTC
import { beforeOffer as webRTCBroadcasterSetup } from "./webrtc/broadcasts.js";
const WebRTCBroadcastConnectionManager = WebRtcConnectionManager.create({
  beforeOffer: webRTCBroadcasterSetup
});
mount(app, WebRTCBroadcastConnectionManager, `/webrtc-broadcaster`);

// server WebRTC -> client WebRTC
import { beforeOffer as webRTCViewerSetup } from './webrtc/viewer.js'
const WebRTCViewerConnectionManager = WebRtcConnectionManager.create({
  beforeOffer: webRTCViewerSetup
});
mount(app, WebRTCViewerConnectionManager, `/webrtc-viewer`);

app.listen(port, () => {
  console.log(`Socket server listening on port ${port}`)
});
