var socket;
var userID;
var lobbies = {};
 
  function startHeartbeat () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const json = this.response;
        const obj = JSON.parse(json);
        
       console.log(obj)
       const newDiv = document.createElement("div");

       const newContent = document.createTextNode(obj.googleId);
       userID = obj.googleId;
       newDiv.appendChild(newContent);
      
       const currentDiv = document.getElementById("insert");
      
       document.body.insertBefore(newDiv, currentDiv);
      socket = io.connect('/');
      socket.emit('userInfo', { data: obj.googleId});
      
      }
    };
    xhttp.open("GET", "/api/current_user", true);
    xhttp.send();
}   

function endHeartbeat() {
   socket.disconnect();
}

function submitForm() {
  document.getElementById("userID").value = userID;
  document.getElementById("picture").submit();
}

function createLobby() {
  socket.emit('createGame');
  console.log("Creating Game Lobby");
}