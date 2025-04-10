import React from 'react'
import {useState,useEffect} from 'react'
import "./create-room.css"
import GmailInvite from '../gmail-invite/gmail-invite';
import { socket } from '../sidebar/sidebar';

export default function CreateRoom() {
    const [showInviteModal, setShowInviteModal] = useState(false);

    const handleInvite = ()=>{
        setShowInviteModal(true);
    }

    const handleCreate = () => {
        socket.emit("create-room", roomID);
    };

    useEffect(() => {
        socket.on("user-joined", (userId) => {
          console.log("User joined:", userId);
        });
      }, []);
      

  return (
    <div className='create-room'>
        <h2>Create a new meet</h2>
        <div className="form">
      <input type="text"placeholder="Name of the meeting" />
      <input type="text" placeholder="Enter Room ID" />
      {/* <input type="text" placeholder="Enter Password" /> */}
     
      <button className='invite' onClick={handleInvite}>Invite</button>
      <button className="create" onClick={handleCreate}>Create</button>

      {showInviteModal && (
  <div className="gmail-invite-modal">
    <GmailInvite open={showInviteModal} onClose={() => setShowInviteModal(false)} />
  </div>
)}

      </div>
    </div>
  )
}
