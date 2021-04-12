import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class ActiveUsers extends React.Component {
  state = { activeUsers: [] };

  // componentDidMount() {
  //   this.fetchActiveUsers();
  // }

  // fetchActiveUsers = async () => {
  //   const response = await axios.get("/current_users");
  //   // console.log(response);
  //   this.setState({ activeUsers: response });
  // };

  render() {
    return (
      <div className="ActiveUsers">
        {/* {this.state.activeUsers.map((item) => {
          return <li>item</li>;
        })} */}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(ActiveUsers);
