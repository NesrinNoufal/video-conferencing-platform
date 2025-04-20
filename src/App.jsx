import "./App.css"
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";


const App = () => {
    
  return (
    <div className="app">
           <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/meet-room/:roomID" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;

