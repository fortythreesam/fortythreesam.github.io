(function (){
  
	var vehicle = {
			x: 30,
			y: 30,
			speed: 0,
			x_speed:0,
			y_speed:0,	
			max_speed: 50,
			acceleration: 0.7,
			decceleration:0.1,
			handling: 0.10,
			moving_direction: 0,
			facing_direction:0
		};
	var vehicle_image = new Image();
	vehicle_image.src = "images/ship_image.png";
	var bullet_image = new Image();
	bullet_image.src = "images/bullet_image.png";
	var bullets = []
	var bullet_timer = 0;
	var image_index = 0;
	var accelerating = false;
	var clockwise = false;
	var counterclockwise = false;
	var reverse = false;
	var shooting = false;

    document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
		window.setInterval(update,16);
		window.addEventListener("keydown",controls);
		window.addEventListener("keyup",controlsEnd);
    }
	
	function update(){
		if (accelerating && reverse === false){
			if (Math.abs(vehicle.x_speed) >= Math.abs(vehicle.max_speed * Math.cos(vehicle.facing_direction))){
				vehicle.x_speed -= Math.sign(vehicle.x_speed)-1*vehicle.acceleration * Math.cos(vehicle.facing_direction)
			}
			else{
				vehicle.x_speed += (vehicle.acceleration * Math.cos(vehicle.facing_direction))
			}
			if (Math.abs(vehicle.y_speed) >= Math.abs(vehicle.max_speed * Math.sin(vehicle.facing_direction))){
				vehicle.y_speed -= Math.sign(vehicle.y_speed)-1 * (vehicle.acceleration * Math.sin(vehicle.facing_direction))
			}
			else{
				vehicle.y_speed += -1 * (vehicle.acceleration * Math.sin(vehicle.facing_direction))
			}
		}
		else{
			if(Math.abs(vehicle.x_speed) < 0.5){
				vehicle.x_speed = 0
			}
			if(Math.abs(vehicle.y_speed) < 0.5){
				vehicle.y_speed = 0
			}
		}
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
		vehicle.x += vehicle.x_speed;
		vehicle.y += vehicle.y_speed;
		image_index = Math.round((vehicle.facing_direction * (180/Math.PI))/2);
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
		if (image_index === 180){
			image_index = 0;
		}		
		
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
		context.drawImage(vehicle_image,0 + 64*image_index,0,64,64,vehicle.x-32,vehicle.y-32,64,64);
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
  
    function getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 
