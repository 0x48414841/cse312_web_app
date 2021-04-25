// Establish a WebSocket connection with the server
const activeUsers = new WebSocket('ws://' + window.location.host + '/websocket/active_users');
const socket = new WebSocket('ws://' + window.location.host + '/websocket/dm_notifications');
activeUsers.onmessage = addMessage;

// Allow users to send messages by pressing enter instead of clicking the Send button
document.addEventListener("keypress", function (event) {
    if (event.code === "Enter") {
        sendMessage();
    }
 });
 
 // Read the name/comment the user is sending to chat and send it to the server over the WebSocket as a JSON string
 // Called whenever the user clicks the Send button or pressed enter
 function sendMessage() {
    const chatName = document.getElementById("chat-name").value;
    const chatBox = document.getElementById("chat-comment");
    const comment = chatBox.value;
    chatBox.value = "";
    chatBox.focus();
    if(comment !== "") {
        socket.send(JSON.stringify({'username': chatName, 'comment': comment}));
    }
 }
 
 // Called when the server sends a new message over the WebSocket and renders that message so the user can read it
 function addMessage(message) {
     chatMessage = ''
     try {
     chatMessage = JSON.parse(message.data);
     let chat = document.getElementById('chat');
     chat.innerHTML += "<b>" + chatMessage['username'] + "</b>: " + chatMessage["comment"] + "<br/>";
    } catch(e) {
    
     let users = document.getElementById('activeUsers');
     
     //console.log(this.response);	
     prev = users.innerHTML
     users.innerHTML = ''
     const chatMessage = JSON.parse(message.data);
     for(var i = 0 ; i < chatMessage.Users.length; i++) {
        switch (chatMessage.Action) {
            case 'displayUsers':
                /*var	request	=  new	XMLHttpRequest();	
                request.username = chatMessage.Users[i].ProfilePic
                request.onreadystatechange = function() {	
				    if	(this.readyState === 4 && this.status === 200){	
						console.log(this.response);	
				    }	
                };	
                request.open("GET","/image?username="+chatMessage.Users[i].ProfilePic);	
                let	data = {'username':	"Jesse", 'message':	"Welcome"}	
                request.send(JSON.stringify(data));*/
                users.innerHTML += `<div> <img src="`+chatMessage.Users[i].ProfilePic + `"class="img-circle rounded float-left" width="50px" height="50px"  style="float: left;"/> <h6>`  + chatMessage.Users[i].Username + '</h6> <br>'
                break;
                
        }
    }
     console.log('made it')
 
    }
   
 }

 function createLobby() {
    const form = new FormData(document.getElementById('createLobby-form'));
    form.get('lobbyId')
   fetch('/createLobby', {
       method: 'POST',
       body: form
   }).then(res => {
       console.log("Request complete! response:", res);
   });
}

 function joinGame() {
     id =  document.getElementById('joinLobbyId').value;
     window.location.href = '/game?lobbyId='+id
 }
 
 function changeBackground() {
     r = Math.floor(Math.random() * 122) + 100; //keeps colors light 
     g = Math.floor(Math.random() * 122) + 100; //keeps colors light 
     b = Math.floor(Math.random() * 122) + 100; //keeps colors light 
     document.body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
 }
 
 function sendImage() {
     const chatName = document.getElementById("chat-name").value;
     const file = document.getElementById("chat-image").files[0];
     b = new Blob([file])
     socket.send(b)
 }


 setInterval(function() {
    activeUsers.send(JSON.stringify({'ping': true}) );
  }, 1000 );