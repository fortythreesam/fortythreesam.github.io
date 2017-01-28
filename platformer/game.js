(function (){
  
	var game_state;
	var level;
	var player = {}
	var player_image = new Image()
	player_image.src = "images/player.png"
	var gravity = 0.5;
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
		
		game_state = 1;
		level = level1;
		
		player.on_ground = false;
		player.right = 0;
		player.left = 0;
		player.speedx = 0;
		player.speedy = 0;
		player.max_speed= 7;
		player.acceleration = 0.3;
		player.x = 300;
		player.y = 300;
		player.draw = function() {context.drawImage(player_image,player.x,player.y)};
		
		window.setInterval(update,16);
		window.addEventListener("keydown",controls);
		window.addEventListener("keyup",controlsEnd);
    }
	
	function update(){
		switch(game_state){
			case 1:
				if( player.direction == 0){
					if(player.speedx > 0){
						player.speedx -= player.acceleration * 3;
					}
					else{
						player.speedx= 0;
					}
				}
				else{
					if (player.speedx < player.max_speed){
						player.speedx += player.acceleration;
					}
					else{
						player.speedx = player.max_speed;
					}
				}
				horizontalCollision()
				verticalCollision();
				if (player.on_ground){
					player.speedy = 0;
				}
				else{
					if(player.speedy < player.max_speed){
						player.speedy +=  gravity;
					}
					else{
						player.speedy = player.max_speed;
					}
				}
				player.x += player.speedx * (player.right + player.left);
				player.y += player.speedy
				break;
		}
	    draw()
	}
	
	function draw() {
		context.clearRect(0,0,width,height)
		context.fillStyle = "#453546"
		context.fillRect(0,0,width,height)
		switch(game_state){
				case 1:
					player.draw()
					for (var y = 0; y < level.length; y ++){
						for (var x = 0; x < level[y].length; x ++){
							if (level[y][x] === 1){
								context.fillStyle = "#223141";
								context.fillRect(x*32,y*32,32,32);
							}
						}
					}
		}
	}
	
	function controls(event) {
		key = event.keyCode
		console.log(key)
		switch(game_state){
			case 1:
				switch(key){
					case 65:
						player.left = -1;
						break;
					case 68:
						player.right = 1;
						break;
					case 16:
						player.max_speed= 13;
						break;
					case 32:
						if(player.on_ground){
							player.speedy = - 12;
							player.on_ground = false;
						}
						break;
				}
		}
	}
	
	function controlsEnd(event){
		key = event.keyCode
		switch(game_state){
			case 1:
				switch(key){
					case 65:
						player.left = 0;
						break;
					case 68:
						player.right = 0;
						break;
					case 16:
						player.max_speed = 7;
						break;
				}
		}
	}
	
	function horizontalCollision(){
		if (player.right == 1){
			if (level[Math.floor(player.y/32)][Math.floor((player.x + 33 + player.speedx)/32)] == 1 ||
				level[Math.floor((player.y+23)/32)][Math.floor((player.x + 33 + player.speedx)/32)] == 1 ||
				level[Math.floor((player.y+47)/32)][Math.floor((player.x + 33 + player.speedx)/32)] == 1){
					player.x = Math.ceil(player.x/32)*32;
					player.speedx = 0;
			}
		}
		if (player.left == -1){
			if (level[Math.floor(player.y/32)][Math.floor((player.x -1 - player.speedx)/32)] == 1 ||
			    level[Math.floor((player.y+23)/32)][Math.floor((player.x - 1 - player.speedx)/32)] == 1 ||
			    level[Math.floor((player.y+47)/32)][Math.floor((player.x - 1 - player.speedx)/32)] == 1){
					player.x = Math.floor(player.x/32)*32;
					player.speedx = 0;
			}
		}
	}
	
	function verticalCollision(){
		if (player.speedy >= 0){
			if(level[Math.floor((player.y + 49 + player.speedy)/32)][Math.floor(player.x/32)] == 1 ||
			   level[Math.floor((player.y + 49 + player.speedy)/32)][Math.floor((player.x+31)/32)] == 1){
				player.y = Math.ceil(player.y/32)*32-16;
				player.on_ground = true;
				player.speedy = 0;
			}
			else{
				player.on_ground = false;
			}
		}
		else if (player.speedy < 0){
			if(level[Math.floor((player.y - 1 + player.speedy)/32)][Math.floor(player.x/32)] == 1 ||
			   level[Math.floor((player.y - 1 + player.speedy)/32)][Math.floor((player.x+31)/32)] == 1){
				player.y = Math.floor((player.y-1)/32)*32;
				player.speedy = 0;
			}
		}
	}
	
    function getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 