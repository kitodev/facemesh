
import './App.css';
import React, {useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import {drawBody} from './utilities';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

 const runhandPose = async () => {
   const net = await handpose.load()
   console.log('handPose is loaded');

   setInterval( () => {
     detectBody(net)
   },100)
 }

 const detectBody = async (net) => {
   if(typeof webcamRef.current !== "undefined" 
        && webcamRef.current !== null
        && webcamRef.current.video.readyState === 4 ) {
        
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;

          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          const body = await net.estimateHands(video);
          console.log(body);

          const ctx = canvasRef.current.getContext("2d");
          drawBody(body, ctx);

   }
 }


 runhandPose();
  return (
    <div className="app">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas ref={canvasRef}
         style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
         }}
      />
    </div>
  );
}

export default App;
