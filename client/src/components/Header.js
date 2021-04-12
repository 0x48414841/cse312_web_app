import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";

const Header = (props) => {
  const renderContent = () => {
    switch (props.auth) {
      case null:
        return;
      case false:
        return <a href="/auth/google">Login With Google</a>;
      default:
        return <a href="/api/logout">Logout</a>;
    }
  };

  return (
    <div className="Header flex">
      <div className="title"> The Game</div>
      <div className="login-btn">
        {renderContent()}
      </div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
