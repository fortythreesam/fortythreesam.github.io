(function (){
  
	var vehicle = {
			x: 30,
			y: 30,
			speed: 0,
			x_speed:0,
			y_speed:0,	
			max_speed: 10,
			acceleration: 0.15,
			decceleration:0.01,
			handling: 0.06,
			moving_direction: 0,
			facing_direction:0,
			image_index:0,
			elasticity:0.1,
		};
	var vehicle_image = new Image();
	vehicle_image.src = "images/ship_image.png";
	var bullet_image = new Image();
	bullet_image.src = "images/bullet_image.png";
	var gate_image = new Image();
	gate_image.src = "images/gate_image.png"
	var bullets = []
	var bullet_timer = 0;
	var image_index = 0;
	var accelerating = false;
	var clockwise = false;
	var counterclockwise = false;
	var reverse = false;
	var shooting = false;
	var gate = {
		x1:0,
		y1:0,
		x2:0,
		y2:200,
		distance: 200,
		angle:0,
	};
	var score = -1
    document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
		if (window.innerWidth-18< 1200){
			canvas.width = 1200;
		}
		else if (window.innerWidth-18 > 2200){
			canvas.width = 2200
		}
		else{
			canvas.width = window.innerWidth - 18;
		}
		if (window.innerHeight-18< 800){
			canvas.height = 800;
		}
		else if (window.innerHeight-18 > 1200){
			canvas.height = 1200
		}
		else{
			canvas.height = window.innerHeight - 18;
		}
        width = canvas.width;
        height = canvas.height;
		generateNewGate()
		window.setInterval(update,8);
		window.addEventListener("keydown",controls);
		window.addEventListener("keyup",controlsEnd);
    }
	
	function update(){
	    //calculationg the x and y speed of the ship
		if (accelerating ){
			if (Math.abs(vehicle.x_speed) >= Math.abs(vehicle.max_speed * Math.cos(vehicle.facing_direction))){
				vehicle.x_speed -= Math.sign(vehicle.x_speed)-1 * Math.sign(Math.cos(vehicle.facing_direction))*vehicle.acceleration//Math.sign(vehicle.x_speed)-1*vehicle.acceleration * Math.cos(vehicle.facing_direction)
			}
			else{
				vehicle.x_speed += (vehicle.acceleration *  Math.sign(Math.cos(vehicle.facing_direction)))
			}
			if (Math.abs(vehicle.y_speed) >= Math.abs(vehicle.max_speed * Math.sin(vehicle.facing_direction))){
				vehicle.y_speed -= Math.sign(vehicle.y_speed)-1 * Math.sign(Math.sin(vehicle.facing_direction))*vehicle.acceleration//Math.sign(vehicle.y_speed)-1 * (vehicle.acceleration * Math.sin(vehicle.facing_direction))
			}
			else{
				vehicle.y_speed += -1 * (vehicle.acceleration *  Math.sign(Math.sin(vehicle.facing_direction)))
			}
		}
		//finding any change of direction
		if (counterclockwise){
			if (vehicle.facing_direction + vehicle.handling > (2*Math.PI)){
				vehicle.facing_direction = 0 + (vehicle.handling - ((2*Math.PI) - vehicle.facing_direction));
			}
			else{
				vehicle.facing_direction += vehicle.handling;
			}
		}
		if (clockwise){
			if (vehicle.facing_direction - vehicle.handling < 0){
				vehicle.facing_direction = (2*Math.PI) - (vehicle.handling - vehicle.facing_direction);
			}
			else{
				vehicle.facing_direction -= vehicle.handling;
			}
		}
		//vehicle and gate collision
		for (var i = 0; i <= gate.distance/16; i += 1){
			var gate_x_collision = gate.x1 + i*16*Math.sin(gate.angle)
			var gate_y_collision = gate.y1 + i*16*Math.cos(gate.angle)
			//var gate_x_high = Math.max(gate_x_collision,gate_x_collision + 20*Math.sign(Math.sin(gate.angle)))
			var gate_x_low = Math.min(gate_x_collision,gate_x_collision + 16*Math.sign(Math.sin(gate.angle)))
			//var gate_y_high = Math.max(gate_y_collision,gate_y_collision + 20*Math.sign(Math.cos(gate.angle)))
			var gate_y_low = Math.min(gate_y_collision,gate_y_collision + 16*Math.sign(Math.cos(gate.angle)))
			if (vehicle.x+32+vehicle.x_speed > gate_x_low
			    &&vehicle.x+32+vehicle.x_speed < gate_x_low+24
			    &&vehicle.y+32+vehicle.y_speed > gate_y_low
			    &&vehicle.y+32+vehicle.y_speed < gate_y_low+24){
			    generateNewGate()
			}
		}
		
		//updating the variables
		vehicle.x += vehicle.x_speed;
		vehicle.y += vehicle.y_speed;
		vehicle.image_index = Math.round((vehicle.facing_direction * (180/Math.PI))/2);
		if (vehicle.image_index === 180){
			vehicle.image_index = 0;
		}
		//ship bullets
		if (bullet_timer > 0){
		    bullet_timer -= 1
		}else if (shooting && bullet_timer == 0){
		    bullet = {
				x:vehicle.x,
				y:vehicle.y,
				speed:70,
				direction:vehicle.facing_direction,
				image_index: Math.round((vehicle.facing_direction * (180/Math.PI))/2)%180
				}
				bullets.push(bullet)
				bullet_timer = 15
		}
		for(var i = 0; i < bullets.length; i += 1){
			bullets[i].x += Math.cos(bullets[i].direction)*bullets[i].speed
			bullets[i].y += -1*Math.sin(bullets[i].direction)*bullets[i].speed
			if  (bullets[i].x > width + 64 ||  bullets[i].x < -64 
			    ||bullets[i].y > height + 64 || bullets[i].y < -64){
				bullets.splice(i,1)
			}    
		}
		//making sure the ship isnt out of bounds
		if (vehicle.x > width + 32){
			vehicle.x = -31
		}
		else if(vehicle.x < -32){
			vehicle.x = width + 31
		}
		if (vehicle.y > height + 32){
			vehicle.y = -31
		}
		else if(vehicle.y < -32){
			vehicle.y = height + 31
		}
		
		draw();
	}
	
	function draw() {
		context.clearRect(0,0,width,height);
		for(var i = 0; i < bullets.length; i += 1){
			context.drawImage(bullet_image,0 + 48*bullets[i].image_index,0,48,48,bullets[i].x-24,bullets[i].y-24,48,48);
		}
		context.drawImage(gate_image,gate.x1,gate.y1,32,32);
		context.drawImage(gate_image,gate.x2,gate.y2,32,32);
		context.drawImage(vehicle_image,0 + 64*vehicle.image_index,0,64,64,vehicle.x-32,vehicle.y-32,64,64);
		
	}
	
	function controls(event) {
		key_code = event.keyCode;
		if (key_code === 87 && accelerating === false){
			//w
			accelerating = true;
		}
		else if (key_code === 65){
			//a
			counterclockwise = true;
		}
		else if (key_code === 68){
			//d
			clockwise = true;
		}
		else if (key_code === 83){
			//s
			reverse = true
		}
		else if (key_code === 32){
			//space
			shooting = true
		}
	}
	
	function controlsEnd(event){
		key_code = event.keyCode;
		if (key_code === 87){
			accelerating = false;
		}
		else if (key_code === 65){
			counterclockwise = false;
		}
		else if (key_code === 68){
			clockwise = false;
		}
		else if (key_code === 83){
			reverse = false;
		}
		else if (key_code === 32){
			
			shooting = false
		}
	}
	
	function generateNewGate(){
	    gate.x1 = getRandomNumber(200,width-200)
	    gate.y1 = getRandomNumber(200,height-200)
	    gate.angle = (getRandomNumber(1,360)/360)*Math.PI
	    gate.x2 = gate.x1 + Math.sin(gate.angle)*gate.distance 
	    gate.y2 = gate.y1 + Math.cos(gate.angle)*gate.distance
	    score += 1
	    console.log(score)
	}
	
    function getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 