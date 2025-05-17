import React, { useEffect, useRef, useState } from "react";
import { socket } from "../sidebar/sidebar";
import { useParams } from "react-router-dom";
import "./meet-room.css";

const VideoRoom = ({ roomID, isJoined }) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  const toggleMic = () => {
    if (!localStream) return;
    const micTrack = localStream.getAudioTracks()[0];
    micTrack.enabled = !micTrack.enabled;
    setMicEnabled(micTrack.enabled);
  };

  const toggleCamera = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setCameraEnabled(videoTrack.enabled);
  };

  const startScreenShare = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const screenTrack = screenStream.getVideoTracks()[0];
    Object.values(peersRef.current).forEach((peer) => {
      const sender = peer._pc
        .getSenders()
        .find((s) => s.track.kind === "video");
      sender.replaceTrack(screenTrack);
    });

    screenTrack.onended = () => {
      const videoTrack = localStream.getVideoTracks()[0];
      Object.values(peersRef.current).forEach((peer) => {
        const sender = peer._pc
          .getSenders()
          .find((s) => s.track.kind === "video");
        sender.replaceTrack(videoTrack);
      });
    };
  };
  useEffect(() => {
    console.log("roomID", roomID);
    console.log("isJoined", isJoined);
  }, [roomID, isJoined]);

  return (
    <div className="meet-room">
      {isJoined ? (
        <div className="meet-screen">
          <div className="video-grid">
            <div className="video-grid">
              {/* Local video */}
              {stream && (
                <video
                  key="local"
                  ref={(video) => {
                    if (video) video.srcObject = localStream;
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="video-tile"
                />
              )}

              {/* Remote peers */}
              {Object.entries(streams).map(([peerId, stream]) => (
                <video
                  key={peerId}
                  ref={(video) => {
                    if (video) video.srcObject = stream;
                  }}
                  autoPlay
                  playsInline
                  className="video-tile"
                />
              ))}
            </div>
          </div>
          <div className="controls">
            <button onClick={toggleMic}>
              {micEnabled ? "Mute Mic" : "Unmute Mic"}
            </button>
            <button onClick={toggleCamera}>
              {cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <button onClick={startScreenShare}>Share Screen</button>
          </div>
        </div>
      ) : (
        <div className="no-meet"></div>
      )}
    </div>
  );
};

export default VideoRoom;
