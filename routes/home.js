var socket;
var userID;
function startHeartbeat() {


  let response = await fetch('/api/current_user');
  obj = JSON.parse(json);

  console.log(obj)
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode(obj.googleId);
  userID = obj.googleId
  newDiv.appendChild(newContent);
  const currentDiv = document.getElementById("insert");

  document.body.insertBefore(newDiv, currentDiv);
  socket = io.connect('/');
  socket.emit('userInfo', { data: obj.googleId });
}

function endHeartbeat() {
  socket.disconnect();
}

function submitForm() {
  document.getElementById("userID").value = userID;
  document.getElementById("picture").submit();
}