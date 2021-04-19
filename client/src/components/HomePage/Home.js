import React, { Component } from "react";
import { connect } from "react-redux";
import Chat from "../ChatFeature/Chat/Chat";
import JoinLobby from "./JoinLobby/JoinLobby";
import UploadProfilePic from "./UploadProfilePic";
import * as actions from "../../actions";

class Home extends Component {
  state = { activeUsers: [] };

  componentDidMount() {
    this.props.fetchUser();
  }

  renderContent() {
    const { email } = this.props.auth;
    console.log(this.props);
    return (
      <div className="grid-container">
        <Chat {...this.props} email={email} globalChat/>
        <UploadProfilePic />
        <JoinLobby />
      </div>
    );
  }

  render() {
    return this.props.auth && this.renderContent();
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Home);
