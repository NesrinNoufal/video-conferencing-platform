import { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import "./sidebar.css";
import { Link } from "react-router-dom";
import CreateRoom from "../create-meet/create-room";
import { SocketContext } from "../../context";

const Sidebar = ({ roomID, handleChangeRoomId }) => {
  const { call, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  const [view, setView] = useState("join");

  return (
    <div className="sidebar">
      {view === "join" && (
        <div className="join-container">
          <h2>Join a Room</h2>
          <div className="join-a-meet">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomID}
              onChange={(e) => handleChangeRoomId(e.target.value)}
            />
            <button
              onClick={() => {
                if (roomID.trim()) callUser(roomID);
                else alert("Please enter a valid Room ID");
              }}
            >
              Join
            </button>
          </div>
          <div className="create-meet">
            <p onClick={() => setView("create")}>Create a new meet</p>
          </div>
        </div>
      )}
      {view === "create" && <CreateRoom setView={setView} />}
    </div>
  );
};

export default Sidebar;
