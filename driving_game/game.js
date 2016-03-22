(function (){
  
	var vehicle = {
			x: 30,
			y: 30,
			speed: 0,
			max_speed: 25,
			acceleration: 0.3,
			handling: 0.10,
			moving_direction: 0,
			facing_direction:0
		};
	var vehicle_image = new Image();
	vehicle_image.src = "ship_image.png";
	var image_index = 0;
	var accelerating = false;
	var clockwise = false;
	var counterclockwise = false;
	var reverse = false;
	var gate

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
		if (reverse){
			vehicle.speed -= 1;
		}
		if (accelerating && reverse === false){
			if (vehicle.speed >= vehicle.max_speed){
				vehicle.speed = vehicle.max_speed;
			}
			else{
				vehicle.speed += vehicle.acceleration; 
			}
		}
		else{
			if (vehicle.speed <= 0){
				vehicle.speed = 0;
			}
			else{
				vehicle.speed -= vehicle.acceleration;
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
		vehicle.x += (Math.round(vehicle.speed * Math.cos(vehicle.facing_direction)));
		vehicle.y += -1 * (Math.round(vehicle.speed * Math.sin(vehicle.facing_direction)));		
		
		image_index = Math.round((vehicle.facing_direction * (180/Math.PI))/2);
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
		context.drawImage(vehicle_image,0 + 64*image_index,0,64,64,vehicle.x-32,vehicle.y-32,64,64);
		/*context.fillStyle = "#448844";
		context.fillRect(vehicle.x - 25,vehicle.y - 15, 50, 30);*/
	}
	
	function controls(event) {
		key_code = event.keyCode;
		if (key_code === 87 && accelerating === false){
			console.log(0)
			accelerating = true;
		}
		else if (key_code === 65){
			counterclockwise = true;
		}
		else if (key_code === 68){
			clockwise = true;
		}
		else if (key_code === 83){
			reverse = true
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
	}
  
    function getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 
