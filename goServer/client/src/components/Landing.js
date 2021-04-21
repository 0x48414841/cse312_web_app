import React, { Component } from 'react';
import { connect } from 'react-redux';


class Landing extends Component {
  
  renderContent() {
    console.log(this.props);
    if(this.props.auth){
      return "You are logged in"
    }
    else{
      return "Log in right now"
    }
  }

  render() {
    return (
        this.renderContent()
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Landing);