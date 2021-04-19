import React, { Component } from "react";
import { connect } from "react-redux";
import Chat from '../ChatFeature/Chat/Chat'

class Game extends Component {
  state = { activeUsers: [] };

  render() {
    return (
      <div className="game-container">
        <Chat {...this.props}/>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Game);
