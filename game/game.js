(function (){
	console.log(Math.ceil(35.0));
    var grid = [];
    var width;
    var height;
    var grid_x;
    var grid_y;
	var tile_size = 32;
    var player = {
			x:20,
			y:20,
			max_health: 35,
			health: 35,
			damage: 5,
			defense:0,
			level: 1,
			exp: 0,
			exp_to_next_level:10,
			//["head","body","legs","arms","feet",]
			armour:["","","","",""]
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
	    x:13,
	    y:13
	};    
    var game_state = 0;
    var level = 0;
	var equipment_order = ["Head:","Body:","Legs:","Arms:","Feet:"];
	var vowels = ["a","e","i","o","u","y"];
	var consonants = ["b","c","d","f","g","h","j","k","l","m","n","p","r","s","t","v","w","z"];

    document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        grid_x = Math.round(height/tile_size);
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
		potion("give");potion("give");potion("give");potion("give");potion("give");
		assignImages();
		grid[player.y][player.x] = 100;
		equipItem(generateItem(1));
		equipItem(generateItem(2));
		draw();
		window.addEventListener("keydown",main,false);
    }
  
    function main(event){
		if (game_state === 1) {
			controls(event);
			checkEnemies();
			checkPlayer();
			moveEnemies();
			grid[player.y][player.x] = -1;
		}
		else if(game_state === -3){
			console.log("");
		}
		else{
			menuControls(event);
		}
		draw()
	}
    
    function draw(){
		if (game_state === 1){
			//actual game
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
			//player info
			playerInfo(level);
        }
		else if (game_state === 0){
			//main menu
			context.fillStyle = "#339933";
			context.font = "bolder small-caps 45px Arial";
			context.textAlign = "center";
			context.fillText("[Press E To Start]",width/2,height/2);
		}
        else if (game_state === -2){
			//inventory screen
			context.clearRect(0,0,width,height);
			context.strokeStyle = "#669999";
			context.lineWidth = 8;
			context.strokeRect(10,10,(width/3)-20,height-20);
			context.strokeRect((width/3) + 5,10,2*(width/3) - 265,(height/2)-20);
			//player inventory
			context.font = "bolder 40px Arial";
			context.textAlign = "left";
			context.lineWidth = 6;
			context.strokeRect(15,15 + 55 * inventory_pointer,(width/3)-30,40);
			for (i = 0; i < inventory.length; i += 1){
				context.fillStyle =  "#669999";
				context.font = "bolder 40px Arial";
				context.textAlign = "left";
				context.fillText(inventory[i].name,20,50 + 55*i)
			}
			//player equipment
			for (i = 0; i < player.armour.length;i += 1){
				if (player.armour[i] === ""){
					context.fillText(equipment_order[i],(width/3) + 15,50 + 55*i);
				}
				else{
					context.fillText(equipment_order[i]+player.armour[i].name,(width/3) + 15,50 + 55*i);
				}
			}	
			//player info
			playerInfo(level);
		}
		else if (game_state === - 3){
			context.clearRect(0,0,width,height);
			context.fillStyle = "#339933";
			context.font = "bolder small-caps 45px Arial";
			context.textAlign = "center";
			context.fillText("You got to level:"+level,width/2,height/2);
			context.fillText("Refresh to play again",width/2,height/2+45);
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
		else if (key_code === 69){
			if (player.x === stairs.x && player.y === stairs.y && enemies.length === 0){
				generateLevel()
			}
		}
		else if (key_code === 73){
			game_state = -2;
			inventory_pointer = 0;
		}
		else if (key_code === 81){
			if (enemies.length === 0){
				player.x = stairs.x + 0;
				player.y = stairs.y + 0;
			}
		}
		else{
			console.log(key_code);
		}
		grid[player.y][player.x] = 100;
    }
    
    function menuControls(event){
		key_code = event.keyCode;
		if (key_code === 73 || key_code === 27){
			game_state = 1;
		}
		else if (key_code === 69){
			if (game_state === 0){
				game_state = 1;
				main(0);
			}
			else if (game_state === -2){
				if (inventory[inventory_pointer].type === "potion"){
					potion("use");
				}
			}
		}
		else if (key_code === 87){
			if (game_state === -2){
				if (inventory_pointer > 0){
					inventory_pointer -= 1;
				}
			}
		}
		else if (key_code === 83){
			if (game_state === -2){
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
					player.health -= enemies[i].damage-player.defense;
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
				if (Math.sqrt(Math.pow((i-(grid_x/2)),2)+Math.pow((j-(grid_y)/2),2)) >= ((grid_x/2) - getRandomNumber(1,2))){
					grid[i].push(1);
				}
				else{
					grid[i].push(0);
				}
			}
		}
		level += 1;
		grid[player.y][player.x] = 100;
		generateEnemy(3);
		main(0);
		stairs.x = getRandomNumber(6, grid_x - 6);
		stairs.y = getRandomNumber(6, grid_y - 6);
	}
	
    function generateEnemy(n){
		for (i = 0; i < n; i += 1){
			if (level > 0 && level < 100){
			enemy_x = getRandomNumber(6,grid_x-6);
			enemy_y = getRandomNumber(6,grid_y-6);
			if (grid[enemy_y][enemy_x] === 0){
				enemy = {
				x: enemy_x,
				y: enemy_y,
				health: 2 + 6*level,
				damage:5 + 5*(level-1),
				exp:1 + 4*level + ((level-1) * (level -1)),
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
			player.exp += enemies[i].exp;
			grid[enemies[i].y][enemies[i].x] = 0;
			enemies.splice(i,1);
	    }
	}
    }
	
	function checkPlayer(){
		player.health += 0.25
		if (player.health > player.max_health){
			player.health = player.max_health+0;
		}
		else if (player.health <= 0){
			game_state = -3;
		}
		
		if (player.exp >= player.exp_to_next_level){
			player.damage += 3*player.level;
			player.max_health += 5*player.level;
			player.level += 1;
			player.health = player.max_health;
			player.exp_to_next_level += 5 + (player.exp_to_next_level/2);
		}
	}
	
	function playerInfo(lvl){
		//outlines for info
		context.clearRect(height,0,250,height);
		context.strokeStyle = "#669999";
		context.lineWidth = 8;
		context.strokeRect((height)+10,10,230,(height/2)-20);
		context.strokeRect((height)+10,(height/2)+10,230,(height/2)-20);
		context.font = "bolder 35px Arial";
		context.textAlign = "left";
		context.fillStyle =  "#669999";
		//name,health level etc
		context.fillText("Player Name",(height)+20,50);
		context.fillText("Health:"+Math.ceil(player.health),(height)+20,90);
		context.fillText("Armour:"+player.defense,(height)+20,130);
		context.fillText("Floor:"+lvl,(height)+20,170);
		context.fillText("Level:"+player.level,(height)+20,210);
		context.fillText("Exp:"+player.exp+"/"+player.exp_to_next_level,(height)+20,250);	
	}
	
	function potion(fcn){
		if (fcn === "give"){ 
			p = {
				name: "Health Potion",
				type: "potion",
				id: 0,
				effect: "Restores 25 points of health"
			};
			inventory.push(p);
		}
		else if(fcn === "use"){
			player.health += 25;
			if (player.health > player.max_health){
				player.health = player.max_health + 0;
			}
			inventory.splice(inventory_pointer,1);
		} 
	}
	
	function generateItem(slot){
		if (slot === 0){
			item = {
				name:"Helmet",
				slot: 0,
				defense: 2,
				description: "A sturdy piece of armour"
			}
		}
		else if (slot === 1){
			item = {
				name:"Chestpiece",
				slot: 1,
				defense: 5,
				description: "A sturdy piece of armour"
			}
		}
		else if (slot === 2){
			item ={
				name:"Leggings",
				slot: 2,
				defense: 4,
				description: "A sturdy piece of armour"
			} 
		}
		else if (slot === 3){
			item ={
				name:"Boots",
				slot: 3,
				defense: 3,
				description: "A sturdy piece of armour"
			} 
		}
		else if (slot === 4){
			item ={
				name:"Gloves",
				slot: 4,
				defense: 3,
				description: "A sturdy piece of armour"
			} 
		}
		return item
	}
	
	function equipItem(item){
		player.armour[item.slot] = item;
		player.defense += item.defense;
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
