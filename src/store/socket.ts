import { io, Socket } from "socket.io-client";
import store from "./store";
import { addNewComment } from "./comments.slice";

const socket: Socket = io(import.meta.env.VITE_SOCKET_SERVER_URI);

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("notification", (data) => {
  console.log("Received notification:", data);
  store.dispatch(addNewComment(data));
});

export default socket;
