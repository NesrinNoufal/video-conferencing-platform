import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectToDb from './config/db.js';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Update as needed
    methods: ['GET', 'POST']
  }
});

app.use(cors());

const rooms = {}; // Optional: To track room members manually if needed

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log(`🔗 New user connected: ${socket.id}`);

  socket.on('create-room', (roomID) => {
    socket.join(roomID);
    console.log(`📌 Room created and joined: ${roomID}`);
    socket.emit('room-created', roomID);
  });

  socket.on('join-room', (roomID) => {
    socket.join(roomID);
    console.log(`👤 ${socket.id} joined room: ${roomID}`);

    // Get other users in the room (excluding the joining user)
    const otherUsers = Array.from(io.sockets.adapter.rooms.get(roomID) || [])
      .filter(id => id !== socket.id);

    // Send existing users to the newly joined user
    socket.emit('all-users', otherUsers);

    // Notify others that a new user has joined
    socket.to(roomID).emit('user-joined', socket.id);
  });

  // Signaling - WebRTC exchange
  socket.on('signal', ({ target, signal }) => {
    io.to(target).emit('signal', {
      sender: socket.id,
      signal,
    });
  });

  // Notify users when someone disconnects
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    io.emit('user-disconnected', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  connectToDb(); // Optional: Your DB connection
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
