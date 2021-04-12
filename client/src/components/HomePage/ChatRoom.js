import React, { Component } from "react";
import { connect } from "react-redux";

const ChatRoom = (props) => {
    return (
        <div className="Chat">
        Chat
       </div>
      );
  };
  
  function mapStateToProps({ auth }) {
    return { auth };
  }
  
  export default connect(mapStateToProps)(ChatRoom);