import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './sidebar.css';
import { Link } from 'react-router-dom';
import CreateRoom from '../create-meet/create-room';
import { callUser } from '../../context';

export const socket = io('http://localhost:5000');

const Sidebar = ({roomID,handleChangeRoomId}) => {

    const [view, setView] = useState('join');

    useEffect(() => {
        socket.on("user-joined", (userId) => {
          console.log("User joined:", userId);
        });
      }, []);
      

  return (
    <div className="sidebar">
      {view === 'join' && (
          < div className="join-container">
            <h2>Join a Room</h2>
            <div className="join-a-meet">
            <input
            type="text"
            placeholder="Enter Room ID"
            value={roomID}
            onChange={e => handleChangeRoomId(e.target.value)}
          />
          <button onClick={callUser(roomID)}>Join</button>
          </div>
        <div className="create-meet">
          <p onClick={() => setView('create')}>Create a new meet</p>
        </div>
      </div>
      )}
      {view === 'create' && (
        <CreateRoom setView={setView}/>
      )}
    </div>
  );
}

export default Sidebar;
