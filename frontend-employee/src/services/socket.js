import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5050' 
  : '/';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

socket.on('connect', () => {
  console.log('📡 Socket connected to server');
});

socket.on('disconnect', () => {
  console.log('📡 Socket disconnected');
});

export default socket;
