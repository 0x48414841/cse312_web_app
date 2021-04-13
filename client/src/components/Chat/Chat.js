import React from "react";

import socketClient from "socket.io-client";
 



export class Chat extends React.Component {
  state = {
    timestamp: "no timestamp yet",
  };

  socket = socketClient("http://localhost:5000");

  subscribeToTimer = (cb)  => {
    this.socket.on("timer", (timestamp) => cb(null, timestamp));
    this.socket.emit("subscribeToTimer", 1000);
  }

  constructor(props) {
      super(props)
     this.subscribeToTimer((err, timestamp) =>
      this.setState({
        timestamp,
      })
    );
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          This is the timer value: {this.state.timestamp}
        </p>
      </div>
    );
  }
}
