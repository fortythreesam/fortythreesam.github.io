(function(){
  var canvas;
  var context;

  var player1 = {};
  var player2 = {};
  var goal = 10;
  
  document.addEventListener("DOMContentLoaded",init,false)

  function init(){
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 800;

    player1.progress = 1;
    player1.keyheld = false;
    player1.key = 83;
    player1.possiblekeys = [ 81,87,69,82,65,83,68,70,88,67,86 ];

    player2.progress = 1;
    player2.keyheld = false;
    player2.key = 75;
    player2.possiblekeys = [ 89,85,73,79,72,74,75,76,66,78,77 ];

    window.setInterval(update,16);
    window.addEventListener("keydown",controlStart,false);
    window.addEventListener("keyup",controlEnd,false);

  }

  function update(){
    draw();  
    if (player1.progress%20 == 0){
      player1.progress += 1;
      player1.key = player1.possiblekeys[grn(0,11)]
    }
    if (player2.progress%20 == 0){
      player2.progress += 1;
      player2.key = player2.possiblekeys[grn(0,11)]
    }
  }

  function draw(){
    context.clearRect(0,0,canvas.width,canvas.height)
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#ffffff";
    context.textAlign = "center";

    //player1
    context.fillText("Player1",200,100);
    context.strokeRect(48,375,302,50);
    context.fillText(String.fromCharCode(player1.key),200,150);

    //player2
    context.fillText("Player2",600,100);
    context.strokeRect(450,375,302,50);
    context.fillText(String.fromCharCode(player2.key),600,150);
    
    //progres
    context.fillStyle = "#ff4444";
    if(player1.progress > player2.progress){
      context.fillRect(349,376,-(30 * (player1.progress - player2.progress)),48);
    }
    else if (player2.progress > player1.progress){
      context.fillRect(451,376, (30 * (player2.progress - player1.progress)),48);
    }

  }

  function controlStart(evt){
    var key = evt.keyCode;
    console.log(key);

    switch(key){

      //player1
      case player1.key:
        if (player1.keyheld == false){
	  player1.progress += 1;
	  player1.keyheld = true;
	}
	break

      //player2
      case player2.key:
        if (player2.keyheld == false){
	  player2.progress += 1;
	  player2.keyheld = true;
	}
	break
    }
  }

  function controlEnd(evt){
    var key = evt.keyCode;

    switch(key){

      //player1
      case player1.key:
        player1.keyheld = false;
	break;

      //player2
      case player2.key:
        player2.keyheld = false;
	break;
    }
  
  }

  function grn(min , max){
    return Math.round(Math.random() * (max - min)) + min;
  }

})()
