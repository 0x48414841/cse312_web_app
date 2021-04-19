import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import Header from "./Header/Header";
import Home from "./HomePage/Home";
import Game from "./Game/Game";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Header />
          <Route exact path="/Home" component={Home} />
          <Route exact path="/Game" component={Game} />
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);

// import React from 'react';

// import Chat from './components/Chat/Chat';
// import Join from './components/Join/Join';

// import { BrowserRouter as Router, Route } from "react-router-dom";

// const App = () => {
//   return (
//     <Router>
//       <Route path="/" exact component={Home} />
//       <Route path="/chat" component={Chat} />
//     </Router>
//   );
// }

// export default App;
