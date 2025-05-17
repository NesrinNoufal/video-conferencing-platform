import React from 'react'
import { useState } from 'react'
import { socket } from '../sidebar/sidebar'
import Sidebar from '../sidebar/sidebar'
import VideoRoom from '../meet-room/meet-room';
import "../home/home.css"

const Home = () => {
     const [roomID, setRoomID] = useState("");
    // const [isJoined, setIsJoined] = useState(false);


    // const handleJoinRoom = () => {
    //     if (roomID.trim() === '') return;
    //     socket.emit("join-room", roomID);
    //     setIsJoined(true)
    //   };

  return (
    <div className='home'>
        <Sidebar 
        roomID={roomID}
        // handleJoinRoom={handleJoinRoom}
        handleChangeRoomId={(value)=>setRoomID(value)}
        />
        <VideoRoom 
        roomID={roomID} 
        isJoined={isJoined}
        />
    </div>
  )
}

export default Home;

