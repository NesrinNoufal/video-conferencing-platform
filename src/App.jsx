import "./App.css"
import Sidebar from "./components/sidebar/sidebar";
// import MeetRoom from "./components/meet-room/meet-room";
import { Routes, Route } from "react-router-dom";
import CreateRoom from "./components/create-meet/create-room";
import VideoRoom from "./components/meet-room/meet-room";


const App = () => {
    
  return (
    <div className="app">
           <Routes>
        <Route path="/" element={<Sidebar />} />
        <Route path="/create-meet" element={<CreateRoom />} />
        <Route path="/video-room/:roomID" element={<VideoRoom />} />
      </Routes>
    </div>
  );
};

export default App;

