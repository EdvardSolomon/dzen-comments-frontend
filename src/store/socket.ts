import { io, Socket } from "socket.io-client";
import store from "./store";
import { addNewComment } from "./comments.slice";

const socket: Socket = io(import.meta.env.VITE_SOCKET_SERVER_URI);

socket.on("notification", (data) => {
  store.dispatch(addNewComment(data));
});

export default socket;
