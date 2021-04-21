import { connect } from "react-redux";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const JoinLobby = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="JoinLobby">
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h3 className="heading">Create/Join Lobby</h3>
          <div>
            <input
              placeholder="Name"
              className="joinInput"
              type="text"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Room"
              className="joinInput mt-20"
              type="text"
              onChange={(event) => setRoom(event.target.value)}
            />
          </div>
          <Link
            onClick={(e) => (!name || !room ? e.preventDefault() : null)}
            to={`/game?name=${name}&room=${room}`}
          >
            <button type="submit">
              Sign In
            </button>
          </Link>
          {/* <a
            // onClick={(e) => (!name || !room ? e.preventDefault() : null)}
            href="http://localhost:5000/game"
          >
               Enter Lobby
           </a> */}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(JoinLobby);
