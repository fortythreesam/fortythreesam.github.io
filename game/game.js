(function (){
    var width;
    var height;
    var map = [] ;
    var map_x = 60;
    var map_y = 60;
    var start_x;
    var start_y;
    var start_x_draw;
    var start_y_draw;
    var tiles = 0;
    var tile_size = 32;
    var used_action = false;
    var nothing = {
	    name:"Nothing",
	    slot: -1,
	    defense: 0,
	    damage: 0,
	    description: "No item equipped",
	    price:0
    };
    var player_name = "Your:";
    var player = {
		x:30,
		y:32,
		x_draw:13,
		y_draw:13,
		max_health: 50,
		health: 50,
		damage: 5,
		defense:0,
		level: 1,
		exp: 0,
		exp_to_next_level:10,
		//["head","body","legs","arms","feet",]
		equipment:[nothing,nothing,nothing,nothing,nothing,nothing,nothing],
		gold:0
	};
    var player_image = new Image();
    var stairs_image = new Image();
    var rat_image = new Image();
    var rat_king_image = new Image();
    var snake_image = new Image();
    var snake_queen_image = new Image();
    var floor_image = new Image();
    var wall_image = new Image();
    var chest_image = new Image();
    var inventory = [];
    var not_in_inventory = true;
    var inventory_page = 0;
    var inventory_pointer;
    var menu_pointer;
    var enemies = [];
    var enemy_number;
    var num_dead = 0;
    var stairs = {
	x:30,
	y:30	
    } 
    var game_state = 0;
    var level = 0;
    var equipment_order = ["Head:","Body:","Legs:","Feet:","Arms:","Shield:","Weapon:"];
    var chest = {
	x:30,
	y:28	
    } 
    var unlocked_spells = 1
    var spell_1 = 3;
    var spell_2 = 5;

    document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
	
        for (var i = 0; i < map_y; i += 1){
		map.push([])
		for(var j = 0; j < map_x; j += 1){
			if (i < 20 || j < 20 || i > (map_y-20) || j > (map_x-20)){
				map[i].push(1);
			}
			else{
				map[i].push(0);
			}
		}
        }
        player_image.src = "images/player.png";
	stairs_image.src = "images/door.png";
	rat_image.src = "images/rat.png";
	rat_king_image.src = "images/rat_king.png";
	snake_image.src = "images/snake.png";
	snake_queen_image.src = "images/snake_queen.png";
	floor_image.src = "images/floor.png";
	wall_image.src = "images/wall.png";
	chest_image.src = "images/chest.png";
	map[player.y][player.x] = 100;
	for (var i = 0; i< 5; i += 1){
		potion("give");
	}
	equipItem(generateItem(1));
	equipItem(generateItem(2));
	equipItem(generateItem(6));
	draw();
	window.addEventListener("keydown",main,false);
    }
  
    function main(event){
	if (game_state === 1) {
		//main game
		controls(event);
		if (used_action){
			if (not_in_inventory){	
				checkEnemies();
			}
			checkPlayer();
			map[player.y][player.x] = -1;
		}
	}
	else if(game_state === -3){
		//end screen
		console.log("Game Over");
	}
	else{
		//main and inventory menu
		menuControls(event);
	}
	draw()
    }
    
    function draw(){
		if (game_state === 1){
			//actual game
			//where to start drawing from the map on the x axis 
			if (player.x - 13 < 0){
			    start_x_draw = 0;
			    player.x_draw = player.x
			}
			else if(player.x + 13 > map_x){
			    start_x_draw = map_x - 26;
			    player.x_draw = 26 - (map_x - player.x)
			}
			else{
			    start_x_draw = player.x - 13;
			    player.x_draw = 13
			}
			//same for y axis
			if (player.y - 13 < 0){
			    start_y_draw = 0;
			    player.y_draw = player.y
			}
			else if(player.y + 13 > map_y){
			    start_y_draw = map_y - 26;
			    player.y_draw = 26 - (map_y - player.y)
			}
			else{
			    start_y_draw = player.y - 13;
			    player.y_draw = 13
			}
			//draws terrain
			for (var i = 0; i < 26; i += 1){
				for (var j = 0; j < 26; j += 1){
					//floor shows up by default
					context.drawImage(floor_image,j*tile_size,i*tile_size);
					if (map[start_y_draw + i][start_x_draw + j] === 1){
						//walls
						context.drawImage(wall_image,j*tile_size,i*tile_size);
					}
				}
			}
			//other map features
			context.drawImage(stairs_image,drawCoordinateX(stairs.x)*tile_size,drawCoordinateY(stairs.y)*tile_size);
			context.drawImage(chest_image,drawCoordinateX(chest.x)*tile_size,drawCoordinateY(chest.y)*tile_size);
			//enemies
			for (var i = 0; i < enemies.length; i += 1){
				if (enemies[i].alive){
					context.drawImage(enemies[i].image,drawCoordinateX(enemies[i].x)*tile_size,drawCoordinateY(enemies[i].y)*tile_size);
					if (enemies[i].health < enemies[i].max_health){
						//drawing a health bar for enemies
						var health_missing = Math.round(((enemies[i].max_health - enemies[i].health)/enemies[i].max_health)*32)
						context.fillStyle = "#bb1111";
						context.fillRect(drawCoordinateX(enemies[i].x)*tile_size,drawCoordinateY(enemies[i].y)*tile_size+28,tile_size,4);
						context.fillStyle = "#11bb11";
						context.fillRect(drawCoordinateX(enemies[i].x)*tile_size+health_missing,drawCoordinateY(enemies[i].y)*tile_size+28,tile_size-health_missing,4)
					}
				}
				
			}
			//player
			context.drawImage(player_image,player.x_draw*tile_size,player.y_draw*tile_size);
			if (player.health < player.max_health){
						//player health bar
						var health_missing = Math.round(((player.max_health - player.health)/player.max_health)*32)
						context.fillStyle = "#bb1111";
						context.fillRect(player.x_draw*tile_size,player.y_draw*tile_size+28,tile_size,4);
						context.fillStyle = "#11bb11";
						context.fillRect(player.x_draw*tile_size+health_missing,player.y_draw*tile_size+28,tile_size-health_missing,4)
					}
			playerInfo();
			}
		else if (game_state === 0){
			//main menu
			context.fillStyle = "#339933";
			context.font = "bolder small-caps 45px Arial";
			context.textAlign = "center";
			context.fillText("[Press E To Start]",width/2,height/2);
		}
		else if (game_state === -2){
			//inventory screen layout
			context.clearRect(0,0,width,height);
			context.strokeStyle = "#8a8a5c";
			context.lineWidth = 8;
			context.strokeRect(10,10,(width/3)-20,height-20);
			context.strokeRect((width/3) + 5,10,2*(width/3) - 265,(height/2)-20);
			context.strokeRect((width/3) + 5,(height/2)+10,2*(width/3) - 265,(height/2)-20);
			//player inventory items
			context.font = "bolder 30px Arial";
			context.textAlign = "left";
			context.fillStyle =  "#8a8a5c";
			context.lineWidth = 6;
			for (var i = 0; i <Math.min(inventory.length-(14 * inventory_page),14); i += 1){
				context.fillText(inventory[i + (14*inventory_page)].name,18,73 + 55*i)
			}
			if (inventory.length > 14 + (14 * inventory_page)){
				//displays current page of items
				context.beginPath();
				context.moveTo(width/6 - 10,height - 20);
				context.lineTo(width/6 +10,height - 35);
				context.lineTo(width/6 - 30,height - 35);
				context.fill();
			} 
			if (inventory_page > 0){
				//shows if there are more pages of items
				context.beginPath();
				context.moveTo(width/6 - 10,20);
				context.lineTo(width/6 +10,35);
				context.lineTo(width/6 - 30,35);
				context.fill();
			}
			//player equipment
			for (var i = 0; i < player.equipment.length;i += 1){
				context.fillText(equipment_order[i]+player.equipment[i].name,(width/3) + 15,50 + 55*i);
			}
			playerInfo();
			//inventory pointer and item description
			if (menu_pointer === 0){
				//player inventory item descriptions
				context.strokeRect(15,35 + 55 * (inventory_pointer - (14 * inventory_page)),(width/3)-30,47);
				context.font = "bolder 30px Arial";
				context.fillText(inventory[inventory_pointer].description,(width/3) + 15,(height/2)+50);
				if (inventory[inventory_pointer].type === "armour"){
					context.fillText("Defense:"+inventory[inventory_pointer].defense,(width/3) + 15,(height/2)+100);
					context.fillText("Equipped Defense:"+player.equipment[inventory[inventory_pointer].slot].defense,(width/3) + 15,(height/2)+200);
				}
				else if(inventory[inventory_pointer].type === "potion"){
					context.fillText("Restores:25%",(width/3) + 15,(height/2)+100);
				}
				else if (inventory[inventory_pointer].type === "weapon"){
					context.fillText("Damage:"+inventory[inventory_pointer].damage,(width/3) + 15,(height/2)+100);
					context.fillText("Equipped Damage:"+player.equipment[inventory[inventory_pointer].slot].damage,(width/3) + 15,(height/2)+200);
				}
				context.fillText("Value:"+inventory[inventory_pointer].price,(width/3) + 15,(height/2)+150);
			}
			else if (menu_pointer === 1){
				//player equipment item descriptions
				context.strokeRect((width/3) + 10,15 + 55 * inventory_pointer,2*(width/3) - 275,47)
				context.font = "bolder 30px Arial";
				context.fillText(player.equipment[inventory_pointer].description,(width/3) + 15,(height/2)+50);
				if (player.equipment[inventory_pointer].type === "armour"){
					context.fillText("Defense:"+player.equipment[inventory_pointer].defense,(width/3) + 15,(height/2)+100);
				}
				else if (player.equipment[inventory_pointer].type === "weapon"){
					context.fillText("Damage:"+player.equipment[inventory_pointer].damage,(width/3) + 15,(height/2)+100);
				}
				context.fillText("Value:"+player.equipment[inventory_pointer].price,(width/3) + 15,(height/2)+150);
			}
			else{	
				//spells descriptionns
				context.lineWidth = 6;
				context.strokeRect(height+16,(height/2)+247+ 50 * inventory_pointer,218,45);
				context.font = "bolder 30px Arial";
				if(inventory_pointer === 0){
					context.fillText("Teleports you to a random tile",(width/3) + 15,(height/2)+50);
					context.fillText("in the room",(width/3) + 15,(height/2)+100);
					context.fillText("It recharges after 3 kills",(width/3) + 15,(height/2)+150);
				}	
				else if(inventory_pointer === 1){
					context.fillText("Pushes enemies a small ",(width/3) + 15,(height/2)+50);
					context.fillText("distance back from you",(width/3) + 15,(height/2)+100);
					context.fillText("It recharges after 5 kills",(width/3) + 15,(height/2)+150);
				}
			}
		}
		else if (game_state === - 3){
			//end of game state
			context.clearRect(0,0,width,height);
			context.fillStyle = "#339933";
			context.font = "bolder small-caps 45px Arial";
			context.textAlign = "center";
			context.fillText("You had "+player.gold+" gold",width/2,height/2-45);
			context.fillText("You got to floor:"+level,width/2,height/2);
			context.fillText("Refresh to play again",width/2,height/2+45);
		}
    }
  
    function controls(event){
		key_code = event.keyCode;
		used_action = true
		map[player.y][player.x] = 0;
		if (key_code === 87){
			//w - try move up
			if (map[player.y-1][player.x] < 1){
				player.y -= 1;
			}
			else{
				//see if it is an enemy blocking you and if it is damage it
				checkCollision(player.x,player.y-1)
			}
		}
		else if (key_code === 83){
			//s - try move down
			if (map[player.y+1][player.x] < 1){
				player.y += 1;
			}
			else{
				checkCollision(player.x,player.y+1);
			}
		}
		else if (key_code ===  65){
			//a - try move left
			if (map[player.y][player.x-1] < 1){
				player.x -= 1;
			}
			else{
				checkCollision(player.x-1,player.y)
			}
		}
		else if (key_code === 68){
			//d - try move right
			if (map[player.y][player.x+1] < 1){
				player.x += 1;
			}
			else{
				checkCollision(player.x+1,player.y );
			}
		}
		else if (key_code === 69){
			//e - interact with stairs
			if (player.x === stairs.x && player.y === stairs.y && num_dead === enemies.length){
				generateLevel()
			}
			else{
			    used_action = false;
			}
		}
		else if (key_code === 73){
			//i - opens inventory
			game_state = -2;
			inventory_pointer = 0;
			inventory_page = 0;
			not_in_inventory = false;
			if (inventory.length > 0){
				menu_pointer = 0;
			}
			else{
				menu_pointer = 1;
			}
		}
		else if (key_code === 81){
			//q -auto moves to exit if all enemies are dead 
			if (num_dead === enemies.length){
				player.x = stairs.x + 0;
				player.y = stairs.y + 0;
			}
			else{
			    used_action = false;
			}
		}
		else if (key_code === 88){
			//x - used to wait/do nothing
		}
		else if (key_code === 49){
			//1 - use spell 1
			if (spell_1 >= 3){
				var new_x = getRandomNumber(6,map_x - 6);
				var new_y = getRandomNumber(6,map_y - 6);
				if (map[new_y][player.x] <= 0){
				    player.y = new_y; 
				}
				if (map[player.y][new_x] <= 0){
				    player.x = new_x;
				}
				spell_1 = 0;
			}
		}
		else if (key_code === 50){
			//2 - use spell 2
			if (player.level >= 4 && spell_2 >= 5){
				for (i = 0; i < enemies.length; i += 1){
					if (enemies[i].alive){
						map[enemies[i].y][enemies[i].x] = 0
						if (Math.abs(player.x - enemies[i].x) >= Math.abs(player.y - enemies[i].y)){
							enemies[i].x += Math.sign(enemies[i].x - player.x)*Math.ceil(4/Math.abs(player.x-enemies[i].x));
						}
						else{
							enemies[i].y += Math.sign(enemies[i].y - player.y)*Math.round(4/Math.abs(player.y-enemies[i].y));
						}
						if (map[enemies[i].y][enemies[i].x] > 0){
						    enemies[i].health = 0;
						    enemies[i].alive = false;
						    num_dead += 1;
						}
						else{
						    map[enemies[i].y][enemies[i].x] = 2;
						}
					}
				}
				spell_2 = 0;
			}
		}
		else{
			//player didnt do anything if one of the above keys werent pressed
			used_action = false;
		}
		map[player.y][player.x] = 100;
    }
    
    function menuControls(event){
		//different controls for inventory and main menu
		key_code = event.keyCode;
		if (key_code === 73 || key_code === 27){
			//i || esc - brings you back to the game
			game_state = 1;
			not_in_inventory = true
		}
		else if (key_code === 69){
			//e
			if (game_state === 0){
				//starts the game
				game_state = 1;
				main(0);
			}
			else if (game_state === -2){
				//iteract with the item that inventory pinter points to
				if(menu_pointer === 0){
					if (inventory[inventory_pointer].type === "potion"){
						potion("use");
					}
					else if (inventory[inventory_pointer].type === "armour" || inventory[inventory_pointer].type === "weapon"){
						equipItem(inventory[inventory_pointer]);
						inventory.splice(inventory_pointer,1);
					}
					if (inventory.length === 0){
						menu_pointer = 1
					}
					else if (inventory_pointer > inventory.length-1){
						if (inventory.length - (14 * inventory_page) <= 0){
						    inventory_page -= 1
						}
						inventory_pointer -= 1 ;
					}
				}
			}
		}
		else if (key_code === 87){
			//w - move up in menu/page
			if (game_state === -2){
				if (menu_pointer === 0){
					if (inventory_pointer > 0 + (14 * inventory_page)){
						inventory_pointer -= 1;
					}
					else if(inventory_page > 0){
						inventory_pointer -= 1;
						inventory_page -= 1;
					}
				}
				else{
					if (inventory_pointer > 0){
						inventory_pointer -= 1;
					}
				}
			}
		}
		else if (key_code === 83){
			//s - move down in menu/page
			if (game_state === -2){
				if (menu_pointer === 0){
					if (inventory_pointer < inventory.length-1){
						inventory_pointer += 1;
					}
					if (inventory_pointer > 13 + (14 * inventory_page)){
						inventory_page += 1;
					}
				}
				else if (menu_pointer === 1){
					if (inventory_pointer < 6){
						inventory_pointer += 1;
					}
				}
				else{
					if (inventory_pointer < unlocked_spells-1){
						inventory_pointer += 1;
					}
				}
			}
		}
		else if (key_code === 65){
			//a - move to the menu to the left
			if (game_state === -2){
				if (menu_pointer === 1 && inventory.length > 0){
					menu_pointer = 0;
					inventory_pointer += (14 * inventory_page)
					if (inventory_pointer > inventory.length - 1){
						inventory_pointer = inventory.length - 1;
					} 
				}
				else if (menu_pointer === 2){
				    menu_pointer = 1;
				}
			}
		}
		else if (key_code ===  68){
			//d - move to the menu to the right
			if (game_state === -2){
				if (menu_pointer < 2){
					menu_pointer += 1;
					inventory_pointer = 0;
				}
			}
		}
		else if (key_code === 82){
			//r
			if (game_state === -2){
				if (menu_pointer === 0){
					//sell item in inventory
					player.gold += inventory[inventory_pointer].price;
					inventory.splice(inventory_pointer,1);
					//move the pointer back on item/page if it was the last item
					if (inventory.length === 0){
						menu_pointer = 1;
					}
					else if (inventory_pointer > inventory.length-1){
						if (inventory.length - (14 * inventory_page) <= 0){
						    inventory_page -= 1
						}
						inventory_pointer -= 1 ;
					}
				}
				else{
					//unequip item from equipment
					if (player.equipment[inventory_pointer].name !== "Nothing"){
						inventory.push(player.equipment[inventory_pointer]);
						if (player.equipment[inventory_pointer].type === "armour"){
							player.defense -= player.equipment[inventory_pointer].defense;
						}
						else{
							player.damage -= player.equipment[inventory_pointer].damage;
						}
						equipItem(nothing);
					}
				}
			}
		}
    }
    
    function checkCollision(x,y){
		if (map[y][x] === 2){
			for (i = 0;i < enemies.length; i += 1){
				if (enemies[i].x === x && enemies[i].y === y){
					enemies[i].health -= player.damage;
				}
			}
		}
    }
  
    function generateLevel(){
	    enemies = [];
	    num_dead = 0;
	    generateMap();
	    level += 1;
	    if (level%5 === 0){
			generateEnemy(1,"boss");
			generateEnemy(getRandomNumber(4,6),"enemy");
	    }
	    else{
			generateEnemy(getRandomNumber(7,10),"enemy");
	    }
	    while (true){
		player.x = getRandomNumber(1,59);
		player.y = getRandomNumber(1,59);
		if (map[player.y][player.x] === 0){
		    map[player.y][player.x] = 100;
		    break
		}
	    }
	    while (true){
		stairs.x = getRandomNumber(1,59);
		stairs.y = getRandomNumber(1,59);
		if (map[stairs.y][stairs.x] === 0){
		    break
		}
	    }
	    while (true){
		chest.x = getRandomNumber(1,59);
		chest.y = getRandomNumber(1,59);
		if (map[chest.y][chest.x] === 0){
		    break
		}
	    }
	    while (chest.x === stairs.x && chest.y === stairs.y){
			chest.x = getRandomNumber(6, map_x - 6);
	    } 
	    draw()
	}
	
    function generateMap(){
	map = []
	new_map = [];
	tiles = 0;
	for (var i = 0; i < map_y; i += 1){
	    map.push([]);
	    new_map.push([]);
	    for (var j = 0; j < map_x; j += 1){
		    if (getRandomNumber(0,10) >= 7){
			//-1 and 0 for floor
			map[i].push(-1);
		    }
		    else{
			//1 for wall
			map[i].push(1);
		    }
		    new_map[i].push(1);
		}    
	}
	for (n = 0; n < 3; n += 1){
		for (var i = 0; i < map_x; i += 1){
			for (var j = 0; j < map_y; j += 1){
				neighbours = getNeighbours(i,j);
				if (i === 0 || j === 0 || j === map_y-1 || i === map_x-1){
				    map[j][i] = 1;
				}
				else if (map[j][i] === -1){
				    if (neighbours < 2){
					new_map[j][i] = 1;
				    }
				    else{
					new_map[j][i] = -1;
				    }
				}
				else{
				    if (neighbours > 3){
					new_map[j][i] = -1;
				    }
				    else{
					new_map[j][i] = 1;
				    }
				}
			}
		}
		map = new_map; 
		new_map = [];
		for (var i = 0; i < map_x; i += 1){
			new_map.push([]);
			for (var j = 0; j < map_y; j += 1){
				new_map[i].push(1);
			}
		 }
	}
	while (tiles < 500){
		//finding a large open space from the generation
		findCoordinates()
		tiles = 0;
		for (var i = 0; i < map_x; i += 1){
			for (var j = 0; j < map_y; j += 1){
				if(map[j][i] === 0){
				    map[j][i] = -1;
				}
			}
		}
		floodFill(start_y,start_x);
	}
	//removes cutoff floor tiles
	for (var i = 0; i < map_x; i += 1){
		for (var j = 0; j < map_y; j += 1){
			if (map[j][i] === -1){
				map[j][i] = 1;
			}
		}	
	}
    }
	
    function getNeighbours(x,y){
	var total = 0;
	var check_x;
	var check_y;
	for (var i = x - 1; i < x+2; i += 1){
	    for (var j = y - 1; j < y+2; j += 1){
		if (i != x || j != y){
		check_x = i;
		check_y = j;
		if (i === -1 || i === map_x || j === -1 || j === map_y){
		    total = total + 1;
		}
		else if (map[check_y][check_x] === -1){
		    total = total + 1;
		}
		}
	    }
	}
	return total
    }
    
    function findCoordinates(){
	while (true){
		start_x = getRandomNumber(0,map_x-1);
		start_y = getRandomNumber(0,map_y-1);
		if (map[start_y][start_x] === -1){
		    break
		}
	}	
    }
    
    function floodFill(y,x){
		if (map[y][x] === -1){
			map[y][x] = 0;
			tiles += 1;
			floodFill(y-1,x);
			floodFill(y+1,x);
			floodFill(y,x-1);
			floodFill(y,x+1);
		}
    }
	
    function generateEnemy(n,type){
		if (type === "enemy"){
			while (enemies.length < n){
				enemy_number= getRandomNumber(1,2);
				enemy_x = getRandomNumber(1,map_x-1);
				enemy_y = getRandomNumber(1,map_y-1);
				if (map[enemy_y][enemy_x] === 0){
					if (enemy_number === 1){
					    //rat
					    enemy = {
						    x: enemy_x,
						    y: enemy_y,
						    can_move:true,
						    alive: true,
						    health: 30 + 25*level,
						    max_health: 30 + 25*level,
						    damage:3 + 4*(level) + ((level-1)*(level-1)),
						    exp:1 + 2*level + ((level-1) * (level -1)),
						    image: rat_image
					    };
					}
					else if (enemy_number === 2){
					    //snake
					    enemy = {
						    x: enemy_x,
						    y: enemy_y,
						    can_move:true,
						    alive: true,
						    health: 20 + 20*level,
						    max_health: 20 + 20*level,
						    damage:4 + 5*(level) + ((level-1)*(level-1)) ,
						    exp:1 + 2*level + ((level-1) * (level -1)),
						    image:snake_image
					    };
					}
					map[enemy_y][enemy_x] = 2;
					enemies.push(enemy);
				}
			}
		}
		else if (type === "boss"){
			while (enemies.length < n){
				enemy_number = getRandomNumber(1,2);
				enemy_x = getRandomNumber(1,map_x-1);
				enemy_y = getRandomNumber(1,map_y-1);
				if (map[enemy_y][enemy_x] === 0){
					if (enemy_number === 1){
						//king rat
						enemy = {
							x: enemy_x,
							y: enemy_y,
							can_move:true,
							alive: true,
							health: 300 + 55*level,
							max_health: 300 + 55*level,
							damage:25 + 6*level + ((level-1)*(level-1)),
							exp:100 + 6*level + 2*((level-1) * (level -1)),
							image:rat_king_image
						};
					}
					else if (enemy_number === 2){
						//snake queen
						enemy = {
							x: enemy_x,
							y: enemy_y,
							can_move:true,
							alive: true,
							health: 200 + 45*level,
							max_health: 200 + 45*level,
							damage:30 + 8*level ((level-1)*(level-1)),
							exp:100 + 6*level + 2*((level-1) * (level -1)),
							image:snake_queen_image
						};
					}
					map[enemy_y][enemy_x] = 2;
					enemies.push(enemy);
				}
			}
		}
    }
        
    function checkEnemies(){
		for (i = 0; i < enemies.length;i += 1){
			if (enemies[i].alive && enemies[i].health <= 0){
				player.exp += enemies[i].exp;
				map[enemies[i].y][enemies[i].x] = 0;
				enemies[i].alive = false;
				num_dead += 1;
				spell_1 += 1;
				spell_2 += 1;
			}
			if (enemies[i].alive){
				enemies[i].can_move = true;
				//enemy combat
				if (Math.abs(enemies[i].x - player.x) === 1 && enemies[i].y === player.y){
					player.health -= Math.max(0,enemies[i].damage - player.defense)
					enemies[i].can_move = false;
				}
				else if(Math.abs(enemies[i].y - player.y) === 1 && enemies[i].x === player.x){
					player.health -= Math.max(0,enemies[i].damage - player.defense)
					enemies[i].can_move = false;
				}
				else{
					if (enemies[i].can_move){
						map[enemies[i].y][enemies[i].x] = 0
						if (Math.abs(player.x - enemies[i].x) >= Math.abs(player.y - enemies[i].y)){
							if (player.x > enemies[i].x){
								if (map[enemies[i].y][enemies[i].x + 1] <= 0){
									enemies[i].x += 1;
								}
								else if (player.y >= enemies[i].y){
									if (map[enemies[i].y + 1][enemies[i].x] <= 0){
									enemies[i].y += 1;
									}
								}
								else if (player.y < enemies[i].y){
									if (map[enemies[i].y - 1][enemies[i].x] <= 0){
									enemies[i].y -= 1;
									}
								}
							}
							else if (player.x < enemies[i].x ){
								if (map[enemies[i].y][enemies[i].x - 1] <= 0){
									enemies[i].x -= 1;
								}
								else if (player.y >= enemies[i].y){
									if (map[enemies[i].y + 1][enemies[i].x] <= 0){
									enemies[i].y += 1;
									}
								}
								else if (player.y < enemies[i].y){
									if (map[enemies[i].y - 1][enemies[i].x] <= 0){
									enemies[i].y -= 1;
									}
								}
							}
						}
						else{
							if (player.y > enemies[i].y ){
								if(map[enemies[i].y + 1][enemies[i].x] <= 0){
									enemies[i].y += 1;
								}
								else if (player.x >= enemies[i].x){
									if (map[enemies[i].y][enemies[i].x + 1] <= 0){
									enemies[i].x += 1;
									}
								}
								else if (player.x < enemies[i].x){
									if (map[enemies[i].y][enemies[i].x - 1] <= 0){
									enemies[i].x -= 1;
									}
								}
							}
							else if (player.y < enemies[i].y){
								if(map[enemies[i].y - 1][enemies[i].x] <= 0){
									enemies[i].y -= 1;
								}
								else if (player.x >= enemies[i].x){
									if (map[enemies[i].y][enemies[i].x + 1] <= 0){
									enemies[i].x += 1;
									}
								}
								else if (player.x < enemies[i].x){
									if (map[enemies[i].y][enemies[i].x - 1] <= 0){
									enemies[i].x -= 1;
									}
								}
							}
						}
						map[enemies[i].y][enemies[i].x] = 2;
					}
				}
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
		    player.damage += 2*player.level;
		    player.max_health +=10 + 6*player.level;
		    player.level += 1;
		    if (player.level === 4){
			unlocked_spells += 1;
		    }
		    player.health = player.max_health;
		    player.exp_to_next_level += 5 + Math.round((player.exp_to_next_level/2));
	    }
	    if (player.x === chest.x && player.y === chest.y){
		chest.x = 1000
		giveLoot();
	    } 
    }
	
    function playerInfo(){
	    //outlines for info
	    context.clearRect(height,0,250,height);
	    context.strokeStyle = "#8a8a5c";
	    context.lineWidth = 8;
	    context.strokeRect((height)+10,10,230,230);
	    context.strokeRect((height)+10,250,230,(height/2)-20);
	    context.strokeRect((height)+10,(height/2)+240,230,160);
	    context.font = "bolder 35px Arial";
	    context.textAlign = "left";
	    context.fillStyle =  "#8a8a5c";
	    //mini map
	    context.fillRect(height+30,30,190,190)
	    for (var i = 0; i < 60; i += 1){
		for (var j = 0; j < 60; j += 1){
		    if (map[j][i] === 0){
			context.fillStyle = "#C7C1A9"
			context.fillRect((height + 35)+(i*3),35+(j*3),3,3)
		    }
		    else if (map[j][i] === 1){
			context.fillStyle = "#111111"
			context.fillRect((height + 35)+(i*3),35+(j*3),3,3)
		    }
		    else if (map[j][i] === 2){
			context.fillStyle = "#bb1111";
			context.fillRect((height + 35)+(i*3),35+(j*3),3,3)
		    }
		}
	    } 
	    context.fillStyle = "#F5F52A"
	    context.fillRect((height + 35)+(chest.x*3),35+(chest.y*3),3,3) 
	    context.fillStyle = "#54ACE3"
	    context.fillRect((height + 35)+(stairs.x*3),35+(stairs.y*3),3,3)
	    context.fillStyle = "#11bb11"
	    context.fillRect((height + 35)+(player.x*3),35+(player.y*3),3,3)
	    //name,health level etc
	    context.fillStyle =  "#8a8a5c";
	    context.fillText(player_name,(height)+20,285);
	    context.fillText("Health:"+Math.ceil(player.health),(height)+20,325);
	    context.fillText("Armour:"+player.defense,(height)+20,365);
	    context.fillText("Damage:"+player.damage,(height)+20,405);
	    context.fillText("Floor:"+level,(height)+20,445);
	    context.fillText("Level:"+player.level,(height)+20,485);
	    context.fillText("Exp:"+player.exp+"/",(height)+20,525);
	    context.fillText("        "+player.exp_to_next_level,(height)+20,565);
	    context.fillText("Gold:"+player.gold,(height)+20,605);
	    //spells info
	    context.fillText("Teleport:"+Math.min(spell_1,3)+"/3",(height)+20,(height/2)+280)
	    if (player.level >= 4){
		    context.fillText("Push:"+Math.min(spell_2,5)+"/5",(height)+20,(height/2)+330);
	    }
    }
	
    function potion(fcn,i){
	    n = i || inventory_pointer
	    if (fcn === "give"){ 
		    p = {
			    name: "Health Potion",
			    type: "potion",
			    id: 0,
			    description: "Restores some of your health",
			    price:50
		    };
		    inventory.push(p);
	    }
	    else if(fcn === "use"){
		    player.health += player.max_health/4;
		    if (player.health > player.max_health){
			    player.health = player.max_health + 0;
		    }
		    inventory.splice(n,1);
	    } 
    }
	
    function generateItem(slot){
	    var type = getRandomNumber(0,1);
	    var prefix = ["Enchanted","Reinforced"]
	    var description = ["A magic","An sturdy"];
	    if (slot === 0){
		    item = {
			    name:prefix[type] + " Helmet",
			    type:"armour",
			    slot: 0,
			    defense: 1 + level,
			    description: description[type] + " helmet",
			    price:30 + 15 * level
		    };
	    }
	    else if (slot === 1){
		    item = {
			    name:prefix[type] + " Chestpiece",
			    type:"armour",
			    slot: 1,
			    defense: 3 + 2*level,
			    description: description[type] + " chestpiece",
			    price:100 + 25 * level
		    }
	    }
	    else if (slot === 2){
		    item ={
			    name:prefix[type] + " Leggings",
			    type:"armour",
			    slot: 2,
			    defense: 2 + (2*level),
			    description: description[type] + " pair of leggings",
			    price:70 + 22 * level
		    } 
	    }
	    else if (slot === 3){
		    item ={
			    name:prefix[type] + " Boots",
			    type:"armour",
			    slot: 3,
			    defense: 1 + Math.floor(1.5*level),
			    description: description[type] + " pair of boots",
			    price:40 + 17 * level
		    } 
	    }
	    else if (slot === 4){
		    item ={
			    name:prefix[type] + " Gauntlets",
			    type:"armour",
			    slot: 4,
			    defense: 1 + Math.floor(1.5*level),
			    description: description[type] + " pair of gauntlets",
			    price:50 + 20 * level
		    } 
	    }
	    else if (slot === 5){
		    item ={
			    name:prefix[type] + " Shield",
			    type:"armour",
			    slot: 5,
			    defense: 2 + 2*level,
			    description: description[type] + " shield",
			    price:75 + 20 * level
		    } 
	    }
	    else if (slot === 6){
		    item = {
			    name:prefix[type] +  " Sword",
			    type: "weapon",
			    slot: 6,
			    damage: 4 + 2*level,
			    description: description[type] + " sword",
			    price:100 + 25 * level
		    }
	    }
	    return item;
    }
	
    function equipItem(item){
	    if (item.name === "Nothing"){
		    item_slot = inventory_pointer;
		    player.equipment[inventory_pointer] = item;
	    }
	    else{
		    if (player.equipment[item.slot].name !== "Nothing"){
			    inventory.push(player.equipment[item.slot]);
			    if (item.type === "armour"){
				    player.defense -= player.equipment[item.slot].defense;
			    }
			    else{
				    player.damage -= player.equipment[item.slot].damage;
			    } 
		    }
		    player.equipment[item.slot] = item;
		    if (item.type === "armour"){
			    player.defense += item.defense;
		    }
		    else{
			    player.damage += item.damage;
		    }
	    }
    }
    
    function giveLoot(){
		for(i = 0; i < getRandomNumber(1,3);i += 1){
			potion("give");
		}
		for(i = 0;i < getRandomNumber(1,4);i += 1){
			inventory.push(generateItem(getRandomNumber(0,6)));
		}
		player.gold += getRandomNumber(10*level,75*level)
    }
	
    function drawCoordinateX(x){
	return (player.x_draw - (player.x - x))
    }
    
    function drawCoordinateY(y){
	return (player.y_draw - (player.y - y))
    }
      
    function getRandomNumber(min, max){
	    return Math.round(Math.random() * (max - min)) + min;
    }
  
})(); 