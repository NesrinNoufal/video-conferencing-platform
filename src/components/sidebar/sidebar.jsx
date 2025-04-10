import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './sidebar.css';
import { Link } from 'react-router-dom';
import CreateRoom from '../create-meet/create-room';
import VideoRoom from '../meet-room/meet-room';

export const socket = io('http://localhost:5000');

const Sidebar = () => {
    const [roomID, setRoomID] = useState("");
    const [isJoined, setIsJoined] = useState(false);

    // const navigate = useNavigate();

    const handleJoinRoom = () => {
      if (roomID.trim() === '') return;
      socket.emit("join-room", roomID);
      // navigate(`/video-room/${roomID}`);
      setIsJoined(true)
    };

    useEffect(() => {
        socket.on("user-joined", (userId) => {
          console.log("User joined:", userId);
        });
      }, []);
      

  return (
    <div className="sidebar">
      <div className="sidebar-left">
        <div className="join-container">
          <h2>Join a Room</h2>
          <div className="join-a-meet">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomID}
            onChange={e => setRoomID(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join</button>
          </div>
        </div>
        <div className="create-meet">
           <Link to="/create-meet"><p>Create a new meet</p>
           </Link>
        </div>
      </div>
      
      <div className="sidebar-right">
         {isJoined && (
          <VideoRoom roomID={roomID} />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
