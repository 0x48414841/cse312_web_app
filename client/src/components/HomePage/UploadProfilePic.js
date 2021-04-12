import React, { Component } from "react";
import { connect } from "react-redux";

const UploadProfilePic = (props) => {
  return <div className="UploadProfilePic">Upload Picture</div>;
};
function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(UploadProfilePic);
