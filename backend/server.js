import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectToDb from './config/db.js';
import authRoutes from "./routes/authRoutes.js"

const app = express();
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Update as needed
    methods: ['GET', 'POST']
  }
});

app.use(cors());

//middleware to parse JSON
app.use(express.json());

const rooms = {}; // Optional: To track room members manually if needed

// Socket.io Handlers
io.on("connection", (socket) => {
  socket.emit("me", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name })
  })

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
})


app.use("/auth",authRoutes);

const PORT = 5000;
server.listen(PORT, () => {
  connectToDb(); // Optional: Your DB connection
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
