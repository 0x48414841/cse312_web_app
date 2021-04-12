import React, { Component } from "react";
import { connect } from "react-redux";

const JoinLobby = (props) => {
    return (
       <div className="JoinLobby">Join Lobby</div>
      );
  }
  function mapStateToProps({ auth }) {
    return { auth };
  }
  export default connect(mapStateToProps)(JoinLobby);