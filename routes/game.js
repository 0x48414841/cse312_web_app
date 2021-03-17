App = {
    url: '/api/current_user',
    init: function() {
        console.log("this is exec")
        $.ajax({
            type: "GET",
            url: "/api/current_user",
         })
         .done(function(result)  {
            console.log("\n\n\n\n\n\n\n", res)
            
         })
    },

    bindEvents: function() {
      $(document).on('click', '.btn-vote', App.handleVote);
      $(document).on('click', '#win-count', App.handleWinner);
      $(document).on('click', '#register', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad); });
    },
 
  
  };
  
  /*$(function() {
    $(window).load(function() {
      App.init();
    });
  });*/
  function a () {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const json = this.response;
      const obj = JSON.parse(json);
      
     console.log(obj)
     const newDiv = document.createElement("div");

     const newContent = document.createTextNode(obj.googleId);
   
     newDiv.appendChild(newContent);
   
     const currentDiv = document.getElementById("insert");
     
     document.body.insertBefore(newDiv, currentDiv);
    var socket = io.connect('/');
    socket.emit('userInfo', { data: obj.googleId});
    }
  };
  xhttp.open("GET", "/api/current_user", true);
  xhttp.send();
}

function b() {

}