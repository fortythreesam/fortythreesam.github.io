(function (){
    var grid = [];
    var width;
    var height;
    var grid_x;
    var grid_y;
    var tile_size = 32;
    var nothing = {
	    name:"Nothing",
	    slot: -1,
	    defense: 0,
	    damage: 0,
	    description: "No item equipped",
	    price:0
    };
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
		equipment:[nothing,nothing,nothing,nothing,nothing,nothing,nothing],
		gold:0
	};
    var player_image = new Image();
    var stairs_image = new Image();
    var rat_image = new Image();
	var rat_king_image = new Image();
    var floor_image = new Image();
    var wall_image = new Image();
	var chest_image = new Image();
    var inventory = [];
    var inventory_pointer;
    var menu_pointer;
    var enemies = [];
    var num_dead = 0;
    var stairs = {
	    x:13,
	    y:13
	};    
    var game_state = 0;
    var level = 0;
    var equipment_order = ["Head:","Body:","Legs:","Feet:","Arms:","Shield:","Weapon:"];
    var chest = {
	    x:13,
	    y:11
    };
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
		equipItem(generateItem(6));
		draw();
		window.addEventListener("keydown",main,false);
    }
  
    function main(event){
		if (game_state === 1) {
			combatEnemies();
			controls(event);
			checkEnemies();
			checkPlayer();
			grid[player.y][player.x] = -1;
		}
		else if(game_state === -3){
			console.log("Game Over");
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
			context.drawImage(chest_image,chest.x*tile_size,chest.y*tile_size);
			for (i = 0; i < enemies.length; i += 1){
				if (enemies[i].alive){
					if (enemies[i].id === 20){
						context.drawImage(rat_image,enemies[i].x*tile_size,enemies[i].y*tile_size);
					}
					else if(enemies[i].id === 30){
						context.drawImage(rat_king_image,enemies[i].x*tile_size,enemies[i].y*tile_size);
					}
					if (enemies[i].health < enemies[i].max_health){
						var health_missing = Math.round(((enemies[i].max_health - enemies[i].health)/enemies[i].max_health)*32)
						context.fillStyle = "#bb1111";
						context.fillRect(enemies[i].x*tile_size,enemies[i].y*tile_size+28,tile_size,4);
						context.fillStyle = "#11bb11";
						context.fillRect(enemies[i].x*tile_size+health_missing,enemies[i].y*tile_size+28,tile_size-health_missing,4)
					}
				}
			}
			context.drawImage(player_image,player.x*tile_size,player.y*tile_size);
			//player info
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
			//inventory screen
			context.clearRect(0,0,width,height);
			context.strokeStyle = "#669999";
			context.lineWidth = 8;
			context.strokeRect(10,10,(width/3)-20,height-20);
			context.strokeRect((width/3) + 5,10,2*(width/3) - 265,(height/2)-20);
			context.strokeRect((width/3) + 5,(height/2)+10,2*(width/3) - 265,(height/2)-20);
			//player inventory
			context.font = "bolder 40px Arial";
			context.textAlign = "left";
			context.fillStyle =  "#669999";
			context.lineWidth = 6;
			for (i = 0; i < inventory.length; i += 1){
				context.fillText(inventory[i].name,20,50 + 55*i)
			}
			//player equipment
			for (i = 0; i < player.equipment.length;i += 1){
				context.fillText(equipment_order[i]+player.equipment[i].name,(width/3) + 15,50 + 55*i);
			}
			//inventory pointer and item description
			if (menu_pointer === 0){
				context.strokeRect(15,15 + 55 * inventory_pointer,(width/3)-30,47);
				context.font = "bolder 30px Arial";
				context.fillText(inventory[inventory_pointer].description,(width/3) + 15,(height/2)+50);
				if (inventory[inventory_pointer].type === "armour"){
					context.fillText("Defense:"+inventory[inventory_pointer].defense,(width/3) + 15,(height/2)+100);
				}
				else if(inventory[inventory_pointer].type === "potion"){
					context.fillText("Restores:25%",(width/3) + 15,(height/2)+100);
				}
				else if (inventory[inventory_pointer].type === "weapon"){
					context.fillText("Damage:"+inventory[inventory_pointer].damage,(width/3) + 15,(height/2)+100);
				}
				context.fillText("Value:"+inventory[inventory_pointer].price,(width/3) + 15,(height/2)+150);
			}
			else{
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
			//player info
			playerInfo();
		}
		else if (game_state === - 3){
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
		grid[player.y][player.x] = 0;
		if (key_code === 87){
			//w
			if (grid[player.y-1][player.x] < 1){
				player.y -= 1;
			}
			else{
				checkCollision(player.x,player.y-1)
			}
		}
		else if (key_code === 83){
			//s
			if (grid[player.y+1][player.x] < 1){
				player.y += 1;
			}
			else{
				checkCollision(player.x,player.y+1);
			}
		}
		else if (key_code ===  65){
			//a
			if (grid[player.y][player.x-1] < 1){
				player.x -= 1;
			}
			else{
				checkCollision(player.x-1,player.y)
			}
		}
		else if (key_code === 68){
			//d
			if (grid[player.y][player.x+1] < 1){
				player.x += 1;
			}
			else{
				checkCollision(player.x+1,player.y );
			}
		}
		else if (key_code === 69){
			//e
			if (player.x === stairs.x && player.y === stairs.y && num_dead === enemies.length){
				generateLevel()
			}
		}
		else if (key_code === 73){
			//i
			game_state = -2;
			inventory_pointer = 0;
			if (inventory.length > 0){
				menu_pointer = 0;
			}
			else{
				menu_pointer = 1;
			}
		}
		else if (key_code === 81){
			//q
			if (num_dead === enemies.length){
				player.x = stairs.x + 0;
				player.y = stairs.y + 0;
			}
		}
		else if (key_code === 72){
			//h
			not_used = true;
			i = 0;
			while (i <inventory.length && not_used){
			    if (inventory[i].type === "potion"){
					potion("use",i);
					not_used = false;
			    }
				i += 1;
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
			//i || esc
			game_state = 1;
		}
		else if (key_code === 69){
			//e
			if (game_state === 0){
				game_state = 1;
				main(0);
			}
			else if (game_state === -2){
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
						inventory_pointer -= 1 ;
					}
				}
			}
		}
		else if (key_code === 87){
			//w
			if (game_state === -2){		
				if (inventory_pointer > 0){
					inventory_pointer -= 1;
				}
			}
		}
		else if (key_code === 83){
			//s
			if (game_state === -2){
				if (menu_pointer === 0){
					if (inventory_pointer < inventory.length - 1){
						inventory_pointer += 1;
					}
				}
				else{
					if (inventory_pointer < 6){
						inventory_pointer += 1;
					}
				}
			}
		}
		else if (key_code === 65){
			//w
			if (game_state === -2){
				if (menu_pointer != 0 && inventory.length > 0){
					menu_pointer = 0;
					if (inventory_pointer > inventory.length - 1){
						inventory_pointer = inventory.length - 1;
					} 
				}
			}
		}
		else if (key_code ===  68){
			//s
			if (game_state === -2){
				if (menu_pointer != 1){
					menu_pointer = 1;
					if (inventory_pointer > 6){
						inventory_pointer = 6
					}
				}
			}
		}
		else if (key_code === 82){
			//r
			if (game_state === -2){
				if (menu_pointer === 0){
					player.gold += inventory[inventory_pointer].price;
					inventory.splice(inventory_pointer,1);
					if (inventory.length === 0){
						menu_pointer = 1;
					}
					else if (inventory_pointer > inventory.length-1){
						inventory_pointer -= 1 ;
					}
				}
				else{
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
		if (grid[y][x] >= 20){
			for (i = 0;i < enemies.length; i += 1){
				if (enemies[i].x === x && enemies[i].y === y){
					enemies[i].health -= player.damage;
				}
			}
		}
    }
  
    function generateLevel(){
	    grid = []
		enemies = []
		num_dead = 0
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
	    if (level%10 === 0 || level === 1){
		generateEnemy(1,"boss");
	    }
	    else{
		generateEnemy(3,"enemy");
	    }
	    main(0);
	    stairs.x = getRandomNumber(6, grid_x - 6);
	    stairs.y = getRandomNumber(6, grid_y - 6);
	    chest.x = getRandomNumber(6, grid_x - 6);
	    chest.y = getRandomNumber(6, grid_x - 6);
	    while (chest.x === stairs.x && chest.y === stairs.y){
			chest.x = getRandomNumber(6, grid_x - 6);
	    } 
	}
	
    function generateEnemy(n,type){
		if (type === "enemy"){
			while (enemies.length < n){
				var enemy_type = getRandomNumber(1,Math.ceil(level/10));
				enemy_x = getRandomNumber(6,grid_x-6);
				enemy_y = getRandomNumber(6,grid_y-6);
				if (grid[enemy_y][enemy_x] === 0){
					if (enemy_type === 1){
					    enemy = {
						    x: enemy_x,
						    y: enemy_y,
						    can_move:true,
						    alive: true,
						    health: 2 + 6*level,
						    max_health: 2 + 6*level,
						    damage:10 + 5*(level-1),
						    exp:1 + 4*level + ((level-1) * (level -1)),
						    id:20
					    };
					}
					else if (enemy_type === 2){
					    enemy = {
						    x: enemy_x,
						    y: enemy_y,
						    can_move:true,
						    alive: true,
						    health: 5 + 7*level,
						    max_health: 5 + 7*level,
						    damage:6 + 4*(level-1),
						    exp:1 + 4*level + ((level-1) * (level -1)),
						    id:21
					    };
					}
					    grid[enemy_y][enemy_x] = enemy.id;
					    enemies.push(enemy);
				}
			}
		}
		else if (type === "boss"){
			enemy_x = getRandomNumber(6,grid_x-6);
			enemy_y = getRandomNumber(6,grid_y-6);
			if (grid[enemy_y][enemy_x] === 0){
				enemy = {
					x: enemy_x,
					y: enemy_y,
					can_move:true,
					alive: true,
					health: 200 + 25*level,
					max_health: 200 + 25*level,
					damage:10 + 5*(level-1),
					exp:100 + 6*level + 2*((level-1) * (level -1)),
					id:30
				};
				grid[enemy_y][enemy_x] = enemy.id;
				enemies.push(enemy);
			}
		}
    }
        
    function moveEnemies(i){
		grid[enemies[i].y][enemies[i].x] = 0
		if (Math.abs(player.x - enemies[i].x) >= Math.abs(player.y - enemies[i].y)){
			if (player.x > enemies[i].x){
				if (grid[enemies[i].y][enemies[i].x + 1] <= 0){
					enemies[i].x += 1;
				}
				else if (player.y > enemies[i].y){
					if (grid[enemies[i].y + 1][enemies[i].x] <= 0){
					enemies[i].y += 1;
					}
				}
				else if (player.y < enemies[i].y){
					if (grid[enemies[i].y - 1][enemies[i].x] <= 0){
					enemies[i].y -= 1;
					}
				}
			}
			else if (player.x < enemies[i].x ){
				if (grid[enemies[i].y][enemies[i].x - 1] <= 0){
					enemies[i].x -= 1;
				}
				else if (player.y > enemies[i].y){
					if (grid[enemies[i].y + 1][enemies[i].x] <= 0){
					enemies[i].y += 1;
					}
				}
				else if (player.y < enemies[i].y){
					if (grid[enemies[i].y - 1][enemies[i].x] <= 0){
					enemies[i].y -= 1;
					}
				}
			}
		}
		else{
			if (player.y > enemies[i].y ){
				if(grid[enemies[i].y + 1][enemies[i].x] <= 0){
					enemies[i].y += 1;
				}
				else if (player.x > enemies[i].x){
					if (grid[enemies[i].y][enemies[i].x + 1] <= 0){
					enemies[i].x += 1;
					}
				}
				else if (player.x < enemies[i].x){
					if (grid[enemies[i].y][enemies[i].x - 1] <= 0){
					enemies[i].x -= 1;
					}
				}
			}
			else if (player.y < enemies[i].y){
				if(grid[enemies[i].y - 1][enemies[i].x] <= 0){
					enemies[i].y -= 1;
				}
				else if (player.x > enemies[i].x){
					if (grid[enemies[i].y][enemies[i].x + 1] <= 0){
					enemies[i].x += 1;
					}
				}
				else if (player.x < enemies[i].x){
					if (grid[enemies[i].y][enemies[i].x - 1] <= 0){
					enemies[i].x -= 1;
					}
				}
			}
		}
		grid[enemies[i].y][enemies[i].x] = enemies[i].id;
    }
    
    function combatEnemies(){
		for (i = 0; i < enemies.length;i += 1){
			if (enemies[i].alive){
				enemies[i].can_move = true;
				if (Math.abs(enemies[i].x - player.x) === 1 && enemies[i].y === player.y){
					player.health -= Math.max(0,enemies[i].damage - player.defense)
					enemies[i].can_move = false;
				}
				else if(Math.abs(enemies[i].y - player.y) === 1 && enemies[i].x === player.x){
					player.health -= Math.max(0,enemies[i].damage - player.defense)
					enemies[i].can_move = false;
				}
			}
		}
    }
    
    function checkEnemies(){
		for (i = 0; i < enemies.length;i += 1){
			if (enemies[i].alive){
				if (enemies[i].health <= 0){
					player.exp += enemies[i].exp;
					grid[enemies[i].y][enemies[i].x] = 0;
					enemies[i].alive = false;
					num_dead += 1;
				}
				else{
					if (enemies[i].can_move){
						moveEnemies(i);
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
		    player.damage += 3*player.level;
		    player.max_health += 5*player.level;
		    player.level += 1;
		    player.health = player.max_health;
		    player.exp_to_next_level += 5 + (player.exp_to_next_level/2);
	    }
	    if (player.x === chest.x && player.y === chest.y){
		chest.x = -1
		giveLoot();
	    } 
    }
	
    function playerInfo(){
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
	    context.fillText("Damage:"+player.damage,(height)+20,170);
	    context.fillText("Floor:"+level,(height)+20,210);
	    context.fillText("Level:"+player.level,(height)+20,250);
	    context.fillText("Exp:"+player.exp+"/"+player.exp_to_next_level,(height)+20,290);
	    context.fillText("Gold:"+player.gold,(height)+20,330);
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
	    if (slot === 0){
		    item = {
			    name:"Helmet",
			    type:"armour",
			    slot: 0,
			    defense: 2,
			    description: "A sturdy piece of armour",
			    price:30 + 15 * level
		    };
	    }
	    else if (slot === 1){
		    item = {
			    name:"Chestpiece",
			    type:"armour",
			    slot: 1,
			    defense: 5,
			    description: "A sturdy piece of armour",
			    price:100 + 25 * level
		    }
	    }
	    else if (slot === 2){
		    item ={
			    name:"Leggings",
			    type:"armour",
			    slot: 2,
			    defense: 4,
			    description: "A sturdy piece of armour",
			    price:70 + 22 * level
		    } 
	    }
	    else if (slot === 3){
		    item ={
			    name:"Boots",
			    type:"armour",
			    slot: 3,
			    defense: 3,
			    description: "A sturdy piece of armour",
			    price:40 + 17 * level
		    } 
	    }
	    else if (slot === 4){
		    item ={
			    name:"Gauntlets",
			    type:"armour",
			    slot: 4,
			    defense: 3,
			    description: "A sturdy piece of armour",
			    price:50 + 20 * level
		    } 
	    }
	    else if (slot === 5){
		    item ={
			    name:"Shield",
			    type:"armour",
			    slot: 5,
			    defense: 5,
			    description: "A strong shield",
			    price:75 + 20 * level
		    } 
	    }
	    else if (slot === 6){
		    item = {
			    name: "Sword",
			    type: "weapon",
			    slot: 6,
			    damage: 7,
			    description: "A reliable sword",
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
		for(i = 0; i < getRandomNumber(0,2);i += 1){
			potion("give");
		}
		for(i = 0;i < getRandomNumber(1,4);i += 1){
			inventory.push(generateItem(getRandomNumber(0,6)));
		}
		player.gold += getRandomNumber(10*level,75*level)
    }
	
    function assignImages(){
	    player_image.src = "images/player.png";
	    stairs_image.src = "images/door.png";
	    rat_image.src = "images/rat.png";
	    floor_image.src = "images/floor.png";
	    wall_image.src = "images/wall.png";
		chest_image.src = "images/chest.png";
		rat_king_image.src = "images/rat_king.png";
    }

    function getRandomNumber(min, max) {
	    return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 