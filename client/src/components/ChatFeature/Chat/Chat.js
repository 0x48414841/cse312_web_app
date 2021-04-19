import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import queryString from "query-string";

import ActiveUsers from "../../ActiveUsers";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

const ENDPOINT = "http://localhost:5000";
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

let socket;
// {pathname: "/chat", search: "?name=jordan&room=ads", hash: "", state: undefined, key: "ciannf"}
const Chat = ({ email, globalChat, location, history }) => {
  const [name, setName] = useState(globalChat ? email.substring(0, email.indexOf("@")): queryString.parse(location.search).name);
  const [room, setRoom] = useState(globalChat ? "Global Chat": queryString.parse(location.search).room);
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Each effect runs after component mounts, AND after any subsequent component re-render (if state or props change)
  // The second arg specifies the values that must change for the effect to be run
  // https://stackoverflow.com/questions/54069253/usestate-set-method-not-reflecting-change-immediately
  // https://stackoverflow.com/questions/55174588/wait-for-state-to-update-when-using-hooks
  useEffect(() => {
    socket = io.connect(ENDPOINT, connectionOptions);

    if (!globalChat) {

      if (!name || !room) {
        history.push("/home");
        alert("enter valid room name");
      }
      
    }

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, name]); // Only re-run the effect if location.search changes

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", {message, room}, () => setMessage(""));
    }
  };

  console.log(name);
  return (
    <React.Fragment>
      <div className="Chat">
        <div className="chat-main-container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage} // sendMessage called when send button is pressed
          />
        </div>
      </div>

      <ActiveUsers users={users} />
    </React.Fragment>
  );
};

export default Chat;
