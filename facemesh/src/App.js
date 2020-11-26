import './App.css';
import react, {useRef} from 'react';
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import {drawMesh} from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFaceMesh = async () => {
    const net = await facemesh.load({
      inputResolution: {width: 640, height: 480},
      scale: 0.8
    });
    setInterval( () => {
      detect(net)
    },100)
  }

  const detect = async (net) => {
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

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);

    }
  }
  runFaceMesh();
  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={
          {
            position:"absolute",
            left: 0,
            marginLeft: "auto",
            marginRight: "auto",
            right: 0,
            zIndex: 9,
            width: 640,
            height: 480
          }
          }
      />  
      <canvas
        ref={canvasRef}
        style={{
            position: "absolute",
            left: 0,
            marginLeft: "auto",
            marginRight: "auto",
            right: 0,
            zIndex: 9,
            width: 640,
            height: 480
        }}
      />
    </div>
  );
}

export default App;
