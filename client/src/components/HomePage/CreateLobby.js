import React, { Component } from "react";
import { connect } from "react-redux";

const CreateLobby = (props) => {
  return <div className="CreateLobby">Create Lobby</div>;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(CreateLobby);
