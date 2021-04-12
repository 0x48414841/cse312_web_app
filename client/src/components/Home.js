import React, { Component } from 'react';
import { connect } from 'react-redux';
import ActiveUsers from './HomePage/ActiveUsers'
import ChatRoom from './HomePage/ChatRoom'
import CreateLobby from './HomePage/CreateLobby'
import JoinLobby from './HomePage/JoinLobby'
import UploadProfilePic from './HomePage/UploadProfilePic'


class Home extends Component {
  
  state = { activeUsers: [] };

  // componentDidMount() {
  //   this.fetchActiveUsers();
  // }

  render() {
    return (
        <React.Fragment>
          <ActiveUsers/>
          <ChatRoom/>
          <UploadProfilePic/>
          <CreateLobby/>
          <JoinLobby/>
        </React.Fragment>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Home);