(function (){
  
	var game_state;
	var level;
	var level_obs = [];
	var player = {}
	var player_image = new Image();
	player_image.src = "images/player.png";
	var door = {};
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
		
		player.on_ground = false;
		player.right = 0;
		player.left = 0;
		player.speedx = 0;
		player.speedy = 0;
		player.max_speed= 5;
		player.max_speedy= 8;
		player.acceleration = 0.3;
		player.jump = false;
		player.jump_time = 0;
		player.deadparts = [];
		player.draw = function() {
			//context.drawImage(player_image,player.x,player.y);
			context.fillStyle = "#898179";
			context.fillRect(player.x,player.y,32,48)
			for(var i = 0; i < player.deadparts.length; i ++){
				player.deadparts[i].x += player.deadparts[i].speed*Math.sin(player.deadparts[i].direction*Math.PI/180);
				player.deadparts[i].y += player.deadparts[i].speed*Math.cos(player.deadparts[i].direction*Math.PI/180);
				player.deadparts[i].size = Math.max(0,player.deadparts[i].size - 1);
				context.fillStyle = "#7A6F64";
				context.fillRect(player.deadparts[i].x,player.deadparts[i].y,player.deadparts[i].size,player.deadparts[i].size);
			}
		};
		player.kill = function(){
			player.deadparts = [];
			for(var i = 0; i < 30;i ++){
				part = {
					x:player.x + 14,
					y:player.y + 22,
					size:grn(13,17),
					direction:grn(0,359),
					speed:grn(3,7)
				}
				player.deadparts.push(part);
			}
			player.x = player.startx;
			player.y = player.starty;
			player.speedx = 0;
			player.speedy = 0;
		}
		
		game_state = 1;
		level_num = 0
		level = levels[level_num];
		createLevel(level);
		
		door.draw = function(){
			context.fillStyle = "#7B7E81";
			context.globalAlpha = 0.3;
			context.fillRect(door.x-4,door.y-4,40,56);
			context.globalAlpha = 1;
			context.fillRect(door.x,door.y,32,48);
		}		
		
		window.setInterval(update,16);
		window.addEventListener("keydown",controls);
		window.addEventListener("keyup",controlsEnd);
    }
	
	function update(){
		switch(game_state){
			case 1:
				moveObstacles();
				if( player.direction == 0){
					if(player.speedx > 0){
						player.speedx -= player.acceleration * 3;
					}
					else{
						player.speedx = 0;
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
				if (player.jump && player.jump_time < 8){
				    player.speedy = -12;
				    player.jump_time += 1;
				}
				if (player.on_ground){
					player.speedy = 0;
				}
				else{
					if(player.speedy < player.max_speedy){
						player.speedy +=  gravity;
					}
					else{
						player.speedy = player.max_speedy;
					}
				}
				player.x += player.speedx * (player.right + player.left);
				player.y += player.speedy;
				horizontalCollision();
				verticalCollision();
				obstacleCollision();
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
					door.draw();
					for (var y = 0; y < level.length; y ++){
						for (var x = 0; x < level[y].length; x ++){
							if (level[y][x] === 1){
								context.fillStyle = "#223141";
								context.fillRect(x*32,y*32,32,32);
							}
						}
					}
					for (var i = 0; i < level_obs.length;i ++){
						switch(level_obs[i].id){
							case 3:
								context.fillStyle = "#883832";
								context.globalAlpha = 1;
								context.fillRect(level_obs[i].x,level_obs[i].y,32,32);
								break;
							case 2:
								context.fillStyle = "#883832";
								if (level_obs[i].direction == 1){
									context.globalAlpha = 0.2;
									context.fillRect(level_obs[i].x,level_obs[i].y-16,32,32);
									context.globalAlpha = 0.4;
									context.fillRect(level_obs[i].x,level_obs[i].y-8,32,32);
								}
								context.globalAlpha = 1;
								context.fillRect(level_obs[i].x,level_obs[i].y,32,32);
								break;
						}
					}
					player.draw();
					break;
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
					case 37:
						player.left = -1;
						break;
					case 68:
						player.right = 1;
						break;
					case 39:
						player.right = 1;
						break;
					case 16:
						player.max_speed= 7;
						break;
					case 32:
						if(player.on_ground){
							player.jump = true;
							player.speedy = -12;
							player.jump_time = 0;
							player.on_ground = false;
						}
						break;
					case 38:
						if(player.on_ground){
							player.jump = true;
							player.speedy = -12;
							player.jump_time = 0;
							player.on_ground = false;
						}
						break;
					case 75:
						player.kill();
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
					case 37:
						player.left = 0;
						break;
					case 68:
						player.right = 0;
						break;
					case 39:
						player.right = 0;
						break;
					case 16:
						player.max_speed = 5;
						break;
					case 32:
						player.jump = false;
					case 38:
						player.jump = false;
				}
		}
	}
	
	function createLevel(next_level){
		level_obs = []
		for (var y = 0; y < level.length; y ++){
			for (var x = 0; x < level[y].length; x ++){
				switch(level[y][x]){
					case 3:
						var next_left = 0;
						var next_right = 0;
						while(true){
							next_left += 1;
							if(level[y][x-next_left] == 1){
								break;
							}
						}
						while(true){
							next_right += 1;
							if(level[y][x+next_left] == 1){
								break;
							}
						}
						sliding_block = {
							id:3,
							startx:(x-next_left+1)*32,
							finalx:(x+next_right+1)*32,
							x:x * 32,
							y:y * 32,
							direction:1,
						}
						level_obs.push(sliding_block);
						level[y][x] = 0;
						break;
					case 2:
						var next_block = 0
						while(true){
							next_block += 1;
							if(level[y+next_block][x] == 1){
								break;
							}
						}
						falling_block = {
							id:2,
							originaly:y*32,
							finaly:(y+next_block-1)*32,
							x:x*32,
							y:y*32,
							direction:1,
						}
						level_obs.push(falling_block);
						level[y][x] = 0;
						break;
						
					case -1:
						door.id = -1;
						door.x = x*32;
						door.y = y*32-16;
						level[y][x] = 0;
						break;	

					case -2:
						player.x = x*32;
						player.y = y*32 - 16;
						player.startx = x*32;
						player.starty = y*32 - 16;
						level[y][x] = 0;
						break;
				}
			}
		}
	}
	
	function horizontalCollision(){
		if (player.right == 1){
			if (level[Math.floor(player.y/32)][Math.floor((player.x + 32 + player.speedx)/32)] == 1 ||
				level[Math.floor((player.y+23)/32)][Math.floor((player.x + 32 + player.speedx)/32)] == 1 ||
				level[Math.floor((player.y+47)/32)][Math.floor((player.x + 32 + player.speedx)/32)] == 1){
					player.x = Math.ceil((player.x-1-player.speedx)/32)*32;
					console.log(player.speedx);
			}
		}
		if (player.left == -1){
			if (level[Math.floor(player.y/32)][Math.floor((player.x - player.speedx)/32)] == 1 ||
			    level[Math.floor((player.y+23)/32)][Math.floor((player.x - player.speedx)/32)] == 1 ||
			    level[Math.floor((player.y+47)/32)][Math.floor((player.x - player.speedx)/32)] == 1){
					player.x = Math.floor((player.x+1 + player.speedx)/32)*32;
			}
		}
	}
	
	function verticalCollision(){
		if (player.speedy >= 0){
			if(level[Math.floor((player.y + 50 + player.speedy)/32)][Math.floor(player.x/32)] == 1 ||
			   level[Math.floor((player.y + 50 + player.speedy)/32)][Math.floor((player.x+31)/32)] == 1){
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
				player.jump = false;
				player.speedy = 0;
			}
		}
	}
	
	function obstacleCollision(){
		for(var i = 0;i < level_obs.length; i++){
			switch(level_obs[i].id){
				case 3:
					if(player.x + 32 > level_obs[i].x && player.x < level_obs[i].x+32 &&
					   player.y + 48 > level_obs[i].y && player.y < level_obs[i].y+32 ){
						player.kill()
					   }
					break;
				case 2:
					if(player.x + 32 > level_obs[i].x && player.x < level_obs[i].x+32 &&
					   player.y + 48 > level_obs[i].y && player.y < level_obs[i].y+32 ){
						player.kill()
					   }
					break;
			}
		}
		if(player.x + 32 > door.x && player.x < door.x+32 &&
		   player.y + 48 > door.y && player.y < door.y+48 ){
			level_num ++;
			level = levels[level_num];
			createLevel(level);
		}
				
	}
		
	function moveObstacles(){
		for(var i = 0;i < level_obs.length; i ++){
			switch(level_obs[i].id){
				case 3:
					if(level_obs[i].direction == 1){
						level_obs[i].x += 4;
						if(level_obs[i].x == level_obs[i].finalx){
							level_obs[i].direction = -1
						}
					}
					else{
						level_obs[i].x -= 4;
						if(level_obs[i].x == level_obs[i].startx){
							level_obs[i].direction = 1
						}
					}
					break;
				case 2:
					if(level_obs[i].direction == 1){
						level_obs[i].y += 4;
						if(level_obs[i].y == level_obs[i].finaly){
							level_obs[i].direction = -1
						}
					}
					else{
						level_obs[i].y -= 2;
						if(level_obs[i].y == level_obs[i].originaly){
							level_obs[i].direction = 1
						}
					}
					break;
			}
		}
	}
	
    function grn(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})();