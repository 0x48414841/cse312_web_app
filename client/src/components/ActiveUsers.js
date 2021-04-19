import React from 'react';

const ActiveUsers = ({ users }) => (
  <div className="ActiveUsers">
    {
      users
        ? (
          <div>
            <h5>People currently chatting:</h5>
            <div className="activeContainer">
              <h6>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                    {name}
                  </div>
                ))}
              </h6>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default ActiveUsers;