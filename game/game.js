(function (){
  
    var grid = [];
    var width;
    var height;
    var grid_x;
    var grid_y;
	var tile_size = 32;
    var player = {
	    x:20,
	    y:20,
	    health: 35,
	    damage: 5
		};
	var player_image = new Image();
	var stairs_image = new Image();
	var rat_image = new Image();
	var floor_image = new Image();
	var wall_image = new Image();
    var inventory = [];
	var inventory_pointer;
    var enemies = [];
    var stairs = {
	    x:14,
	    y:14
	};    
    var level = 0;
    var game_level = 0;

    document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        grid_x = Math.round(width/tile_size);
        grid_y = Math.round(height/tile_size);
        for (var i = 0; i < grid_y; i += 1){
			grid.push([])
			for(var j = 0; j < grid_x; j += 1){
				if (i === 0 || j === 0 || i === (grid_y-1) || j === (grid_x-1)){
					grid[i].push(1);
				}
				else{
					grid[i].push(0);
				}
			}
        }
		var s = {
			name: "Health Potion",
			type: "potion",
			id: 0,
			effect: "Restores 25 points of health"
		};
		inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);
		inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);inventory.push(s);
		assignImages();
		context.fillStyle = "#339933";
		context.font = "bolder small-caps 45px Arial";
		context.textAlign = "center";
		context.fillText("[Press Enter To Start]",width/2,height/2)
		grid[player.y][player.x] = 100;
		//canvas.addEventListener("click", clicked, false);
		window.addEventListener("keydown",main,false);
		drawing = window.setInterval(draw,33);
    }
  
    function main(event){
		if (level > 0) {
			controls(event);
			checkEnemies();
			moveEnemies();
			grid[player.y][player.x] = -1;
		}
		else{
			menuControls(event);
		}
	}
    
    function draw(){
	if (level > 0){
	    for (var i = 0; i < grid_y; i += 1){
			for (var j = 0; j < grid_x; j += 1){
				//floor shows up by default
				context.drawImage(floor_image,j*tile_size,i*tile_size);
				if (grid[i][j] === 1){
					//walls
					context.drawImage(wall_image,j*tile_size,i*tile_size);
				}			
			}
		}
		context.drawImage(stairs_image,stairs.x*tile_size,stairs.y*tile_size);
		for (i = 0; i < enemies.length; i += 1){
			context.drawImage(rat_image,enemies[i].x*tile_size,enemies[i].y*tile_size);
		}
		context.drawImage(player_image,player.x*tile_size,player.y*tile_size);
        }
        else if (level == -2){
			context.clearRect(0,0,width,height);
			context.strokeStyle = "#669999";
			context.lineWidth = 10;
			context.strokeRect(10,10,(width/2)-20,height-20);
			context.strokeRect((width/2)+10,(height/2)+10,(width/2)-20,(height/2)-20);
			//player inventory
			context.lineWidth = 6;
			context.strokeRect(20,25 + 55 * inventory_pointer,(width/2)-40,40);
			for (i = 0; i < inventory.length; i += 1){
				context.fillStyle =  "#669999";
				context.font = "bolder 40px Arial";
				context.textAlign = "left";
				context.fillText(inventory[i].name,30,60 + 55*i)
			}
			//player info
			context.strokeRect((width/2)+10,(height/2)+10,(width/2)-20,(height/2)-20);
			context.fillText("Player Name",(width/2)+20,(height/2)+60);
			context.fillText("Health:"+player.health,(width/2)+20,(height/2)+105);
			context.fillText("Floor:"+game_level,(width/2)+20,(height/2)+150);
		}
    }
  
    function controls(event){
		key_code = event.keyCode;
		grid[player.y][player.x] = 0
		if (key_code === 87){
			if (grid[player.y-1][player.x] < 1){
				//w
				player.y -= 1;
			}
			else{
				checkCollision(player.x,player.y-1)
			}
		}
		else if (key_code === 83){
			if (grid[player.y+1][player.x] < 1){
				//s
				player.y += 1;
			}
			else{
				checkCollision(player.x,player.y+1);
			}
		}
		else if (key_code ===  65){
			if (grid[player.y][player.x-1] < 1){
				//a
				player.x -= 1;
			}
			else{
				checkCollision(player.x-1,player.y)
			}
		}
		else if (key_code === 68){
			if (grid[player.y][player.x+1] < 1){
				//d
				player.x += 1;
			}
			else{
				checkCollision(player.x+1,player.y );
			}
		}
		else if (key_code === 13){
			if (player.x === stairs.x && player.y === stairs.y && enemies.length === 0){
				generateLevel()
			}
		}
		else if (key_code === 80){
			game_level = level + 0;
			level = -2;
			inventory_pointer = 0;
		}
		grid[player.y][player.x] = 100;
    }
    
    function menuControls(event){
	key_code = event.keyCode;
		if (key_code === 80){
			level = game_level + 0;
		}
		else if (key_code === 13){
			if (level === 0){
			//chacge it to pressing enter to play rather than clicking
			level = 1;
			main(0);
			}
		}
		else if (key_code === 87){
			if (level === -2){
				if (inventory_pointer > 0){
					inventory_pointer -= 1;
				}
			}
		}
		else if (key_code === 83){
			if (level === -2){
				if (inventory_pointer < inventory.length - 1){
					inventory_pointer += 1;
				}
			}
		}
    }
    
    function checkCollision(x,y){
	if (grid[y][x] >= 20){
	    for (i = 0;i < enemies.length; i += 1){
		if (enemies[i].x === x && enemies[i].y === y){
		    player.health -= enemies[i].damage;
		    enemies[i].health -= player.damage;
		}
	    }
	}
    }
  
	function generateLevel(){
		grid = []
		for (var i = 0; i < grid_y; i += 1){
			grid.push([]);
			for(var j = 0; j < grid_x; j += 1){
				if (Math.sqrt(Math.pow((i-(grid_x/2)),2)+Math.pow((j-(grid_x)/2),2)) >= ((grid_x/2) - getRandomNumber(1,2))){
					grid[i].push(1);
				}
				else{
					grid[i].push(0);
				}
			}
		}
		level += 1;
		generateEnemy(3);
		main(0);
		stairs.x = getRandomNumber(6, grid_x - 6);
		stairs.y = getRandomNumber(6, grid_y - 6);
	}
	
    function generateEnemy(n){
		for (i = 0; i < n; i += 1){
			if (level > 1 && level <10){
			enemy_x = getRandomNumber(5,grid_x-5);
			enemy_y = getRandomNumber(5,grid_y-5);
			if (grid[enemy_y][enemy_x] === 0){
				enemy = {
				x: enemy_x,
				y: enemy_y,
				health: 10,
				damage:5,
				id:20
				};
				grid[enemy_y][enemy_x] = 20;
				enemies.push(enemy);
			}
			}
		}
    }
    
    function moveEnemies(){
		for (i = 0; i < enemies.length;i += 1){
			grid[enemies[i].y][enemies[i].x] = 0
			if (Math.abs(player.x - enemies[i].x) >= Math.abs(player.y - enemies[i].y)){
			if (player.x > enemies[i].x && grid[enemies[i].y][enemies[i].x + 1] <= 0){
				enemies[i].x += 1;
			}
			else if (player.x < enemies[i].x && grid[enemies[i].y][enemies[i].x - 1] <= 0){
				enemies[i].x -= 1;
			}
			}
			else{
			if (player.y > enemies[i].y && grid[enemies[i].y + 1][enemies[i].x] <= 0){
				enemies[i].y += 1;
			}
			else if (player.y < enemies[i].y && grid[enemies[i].y - 1][enemies[i].x] <= 0){
				enemies[i].y -= 1;
			}
			}
			grid[enemies[i].y][enemies[i].x] = enemies[i].id;
		}
    }
    
    function checkEnemies(){
	for (i = 0; i < enemies.length;i += 1){
	    if (enemies[i].health <= 0){
		grid[enemies[i].y][enemies[i].x] = 0;
		enemies.splice(i,1);
	    }
	}
    }
	
	function assignImages(){
		player_image.src = "images/player.png";
		stairs_image.src = "images/door.png";
		rat_image.src = "images/rat.png";
		floor_image.src = "images/floor.png";
		wall_image.src = "images/wall.png";
	}
  
    function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 
