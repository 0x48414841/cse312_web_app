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
     console.log();
     const newDiv = document.createElement("div");

     const newContent = document.createTextNode(this.responseText);
   
     newDiv.appendChild(newContent);
   
     const currentDiv = document.getElementById("insert");
     document.body.insertBefore(newDiv, currentDiv);
    }
  };
  xhttp.open("GET", "/api/current_user", true);
  xhttp.send();
}