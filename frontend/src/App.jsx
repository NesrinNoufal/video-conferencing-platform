import "./App.css"
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Profile from "./components/profile/profile"
import LoginSignup from "./components/auth/auth";

const App = () => {
    
  return (
    <div className="app">
      <Routes>
            <Route path="/" element={<LoginSignup/>} />
            <Route path="/dashboard" element={<Home/>} />
            <Route path="/meet-room/:roomID" element={<Home />} />
            <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  );
};

export default App;

