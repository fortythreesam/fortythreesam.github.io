(function (){
  
	var player = {}
	var door = {}
	var enemies = []
	var level;
	var width;
	var height;
    document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
		canvas.width = 32*30;
		canvas.height = 32*20;
        width = canvas.width;
        height = canvas.height;
		
		context.font="30px Verdana"
		context.textAlign = "center"
		timer = 60;
		level = 0;
		
		player.x = 30;
		player.y = 30;
		player.left = 0;
		player.right = 0;
		player.up = 0;
		player.down = 0;
		player.speed = 5;
		player.alive=true;
		
		door.x = width - 16
		door.y = height/2 + 16
		
		newLevel();
		
		window.setInterval(update,16);
		window.addEventListener("keydown",controls);
		window.addEventListener("keyup",controlsEnd);
    }
	
	function update(){
		player.x += player.speed * (player.left + player.right);
		player.y += player.speed * (player.up + player.down);
		if (player.x < 0){
		    player.x = 0
		}
		else if(player.x + 32 > width){
		    player.x = width -32
		}
		if (player.y < 0){
		    player.y = 0
		}
		else if(player.y + 32 > height){
		    player.y = height -32
		}
		for(var i = 0; i < enemies.length; i ++){
		    enemies[i].y += 5*enemies[i].direction
		    if (enemies[i].y + 32 >= height || enemies[i].y <= 0){
			    enemies[i].direction *= -1;
			}
		    if (player.x + 32 > enemies[i].x && player.x < enemies[i].x+32 &&
			   player.y + 32 > enemies[i].y && player.y < enemies[i].y + 32){
			     player.alive = false;		   
			}
		}
		if (player.x + 32 > door.x && player.x < door.x+32 &&
			   player.y + 32 > door.y && player.y < door.x + 32){
			       newLevel();
	    }
		
	    draw()
	}
	
	function draw() {
	    context.fillStyle = "#453546";
		context.fillRect(0,0,width,height);
	    if(player.alive){
		
		context.fillStyle = "#7B7E81";
		if (level == 1){
		    context.fillText("WASD TO MOVE",width/2,height/2 - 30)
		    context.fillText("SHIFT TO SPRINT",width/2,height/2 + 30)
		}
		context.fillRect(player.x,player.y,32,32);
		context.fillRect(door.x,door.y,32,32);
		for(var i = 0; i < enemies.length; i ++){
		    context.fillStyle = "#883832"
			context.fillRect(enemies[i].x,enemies[i].y,32,32)
		}
		}
		else{
		    context.fillStyle = "#883832"
		    context.fillText("You got to level "+ level,width/2,height/2)
		}
	}
	
	function newLevel(){
	    enemies = []
		level += 1
		for(var i = 0; i < level; i++){
		    enemies.push(newEnemy())
			console.table(enemies)
		}
		player.x = 0;
		player.y = height/2 - 16;
	}
	
	function newEnemy(){
	    e = {}
		e.x = grn(128,width - 64);
		e.y = grn(0,height-32);
		if (grn(0,1) == 0){
		    e.direction = -1
		}
		else{
		    e.direction = 1
		}
		return e;
	}
	
	function controls(event) {
		key = event.keyCode
		console.log(key)
			switch(key){
				case 65:
					player.left = -1;
					break;
				case 87:
                    player.up = -1;
					break;
                case 83:
                    player.down = 1;
					break;
                case 68:
                    player.right = 1;	
					break;			
				case 16:
				    player.speed = 8;
					break;
		}
	}
	
	function controlsEnd(event){
		key = event.keyCode
			switch(key){
				case 65:
				    player.left = 0;
					break;
				case 87:
                    player.up = 0;
					break;
                case 83:
                    player.down = 0;					
					break;
                case 68:
                    player.right = 0;
					break;	
				case 16:
				    player.speed = 5;
					break;
			}
	}
	
	
	
    function grn(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})();