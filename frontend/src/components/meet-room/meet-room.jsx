import React, { useEffect, useState, useContext } from "react";
import "./meet-room.css";
import { SocketContext } from "../../context";
import user from "../../assets/profile-user.png";
import { Link } from "react-router-dom";
import Profile from "../profile/profile";

const VideoRoom = ({ roomID, isJoined }) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isProfile, setIsProfile] = useState(false);

  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);

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
      {!roomID ? (
        <div className="no-meet">
          <div className="profile">
            <img
              src={user}
              alt="user"
              onClick={() => {
                setIsProfile(true);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="meet-screen">
          <div className="video-grid">
            <div className="video-grid">
              {/* Local video */}
              {stream && (
                <video
                  key="local"
                  ref={myVideo}
                  autoPlay
                  playsInline
                  muted
                  className="video-tile"
                />
              )}

              {/* if callAccepted and call did not end then User's video */}
              {callAccepted && !callEnded && (
                // {Object.entries(streams).map(([peerId, stream]) => (
                <video
                  key={peerId}
                  ref={userVideo}
                  autoPlay
                  playsInline
                  className="video-tile"
                />
              )}
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
      )}
      {isProfile && (
        <div className="profile-modal">
          <div
            className="profile-modal-overlay"
            onClick={() => setIsProfile(false)}
          ></div>
          <div className="profile-modal-content">
            <button className="close-btn" onClick={() => setIsProfile(false)}>
              ✖
            </button>
            <Profile />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;
