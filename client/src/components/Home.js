import React, { Component } from 'react';
import { connect } from 'react-redux';
import ActiveUsers from './HomePage/ActiveUsers'
import ChatRoom from './HomePage/ChatRoom'
import CreateLobby from './HomePage/CreateLobby'
import JoinLobby from './HomePage/JoinLobby'
import UploadProfilePic from './HomePage/UploadProfilePic'
import {Chat} from './Chat/Chat'

 
class Home extends Component {
  
  state = { activeUsers: [] };
 
  // componentDidMount() {
  //   this.fetchActiveUsers();
  // }

  render() {
    return (
        <React.Fragment>
          <Chat></Chat>
          {/* <ActiveUsers/>
          <ChatRoom/>
          <UploadProfilePic/>
          <CreateLobby/>
          <JoinLobby/> */}
        </React.Fragment>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Home);