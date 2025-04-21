import React, { useEffect, useRef, useState } from "react";
import { socket } from "../sidebar/sidebar";
import { useParams } from "react-router-dom";
import "./meet-room.css";

const VideoRoom = ({ roomID, isJoined }) => {
  const [peers, setPeers] = useState({});
  const [streams, setStreams] = useState({});
  const [localStream, setLocalStream] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const peersRef = useRef({});

  useEffect(() => {
    const initMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    };

    initMedia();
  }, []);

  useEffect(() => {
    if (!localStream) return;

    socket.emit("join-room", roomID);

    socket.on("user-joined", ({ userId }) => {
      const peer = createPeer(userId, socket.id, localStream);
      peersRef.current[userId] = peer;
      setPeers((prev) => ({ ...prev, [userId]: peer }));
    });

    socket.on("all-users", (users) => {
      users.forEach((userId) => {
        const peer = createPeer(userId, socket.id, localStream);
        peersRef.current[userId] = peer;
        setPeers((prev) => ({ ...prev, [userId]: peer }));
      });
    });

    socket.on("receive-call", async ({ signal, from }) => {
      const peer = addPeer(signal, from, localStream);
      peersRef.current[from] = peer;
    });

    socket.on("signal", ({ from, signal }) => {
      const peer = peersRef.current[from];
      if (peer) {
        peer.signal(signal);
      }
    });
    socket.on("user-disconnected", (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].destroy();
        delete peersRef.current[userId];
        setPeers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        setStreams((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("all-users");
      socket.off("receive-call");
      socket.off("signal");

      Object.values(peersRef.current).forEach((peer) => peer.destroy());
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  const createPeer = (userToSignal, callerID, stream) => {
    const Peer = require("simple-peer");
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("send-signal", { userToSignal, callerID, signal });
    });

    peer.on("stream", (stream) => {
      setStreams((prev) => ({ ...prev, [userToSignal]: stream }));
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const Peer = require("simple-peer");
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("return-signal", { signal, to: callerID });
    });

    peer.on("stream", (stream) => {
      setStreams((prev) => ({ ...prev, [callerID]: stream }));
    });

    peer.signal(incomingSignal);

    return peer;
  };

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
              {localStream && (
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
