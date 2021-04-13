import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import socketClient  from "socket.io-client";
import * as actions from "../actions";

import Header from "./Header";
import Home from "./Home";

class App extends Component {

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="grid-container">
        <BrowserRouter>
          <Header />
          <Route exact path="/Home" component={Home} />
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
