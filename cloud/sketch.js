var x = 1;
var y = 200;
var transparency = 100;
function setup(){
  createCanvas(800,800);
  background(126,192,238);
  noStroke();
  cloud(400,200,200,75,[242,248,253],getRandomNumber(-0.8,0.8),0.5);
  grass(-20,750,820,50,[ 93, 191, 54 ],90);
}

function draw(){
  /*if (transparency > 0){
    fill(70,200,70,transparency);
    ellipse(x, y, 50, 50);
    x += 2;
    y +=(100 - transparency)/20;
    transparency -= 0.5;
  } */  
}

function cloud(centerX, centerY, radiusX, radiusY, colours, offsetX, offsetY){

  cloudRed = colours[0];
  cloudGreen = colours[1];
  cloudBlue = colours[2]; 
  for(var i = 0; i < 1400; i++){

    nextEllipse = {
      x : getRandomNumber(centerX - radiusX, centerX + radiusX),
      y : getRandomNumber(centerY - radiusY, centerY + radiusY),
      width : getRandomNumber(30,50),
      height : getRandomNumber(30,50),
      alpha : 0
    }

    x_relative = ((nextEllipse.x - (centerX+(radiusX*offsetX)))/radiusX)*100
    y_relative = ((nextEllipse.y - (centerY+(radiusY*offsetY)))/radiusY)*100
    if (Math.abs(offsetX) < 0.15 ){
      x_relative_change = 50
    }
    else if (offsetX < 0){
      x_relative_change = (1 + offsetX)*100
    }
    else{
      x_relative_change = offsetX*100
    }
    if (x_relative >= 0){
      x_relative = 20 + (100 - x_relative_change)  - x_relative
    }
    else{
      x_relative = 20 + x_relative_change + x_relative
    }
    
    if (offsetY < 0){
      y_relative_change = (1 + offsetY)*100
    }
    else{
      y_relative_change = offsetY*100
    }
    if (y_relative >= 0){
      y_relative = 0 + (100 - y_relative_change) - y_relative
    }
    else{
      y_relative= 0 + y_relative_change + y_relative

    }

    nextEllipse.alpha = (x_relative+y_relative)/2
    fill(cloudRed,cloudGreen,cloudBlue,nextEllipse.alpha);
    ellipse(nextEllipse.x, nextEllipse.y, nextEllipse.width, nextEllipse.height);
  }
}

function grass(posX, posY, grass_width, grass_height, colours, angle){
    fill(colours[0],colours[1],colours[2],255);
    grass_particles = (grass_width * grass_height)/4;
    rect(posX,posY+12,grass_width,grass_height);
    for(var i = 0; i < grass_particles; i++){
        fill(colours[0]+getRandomNumber(-5,5),colours[1]+getRandomNumber(-7,7),colours[2]+getRandomNumber(-5,5),255);
        grass_quad = generateGrassQuad(Math.floor(getRandomNumber(posX,posX+grass_width)),Math.floor(getRandomNumber(posY,posY+grass_height)),angle);
        quad(grass_quad.x1,grass_quad.y1,grass_quad.x2,grass_quad.y2,grass_quad.x3,grass_quad.y3,grass_quad.x4,grass_quad.y4);
    }
  
}

function generateGrassQuad(x,y,angle){
    modifier = Math.floor(angle/4);
    height_modifier = getRandomNumber(-2,24);
    new_quad = {
	x1:x+modifier,
	y1:y+4-height_modifier,
	x2:x + 2 + modifier,
	y2:y - 2 - height_modifier,
	x3:x+2,
	y3:y + 12,
	x4:x,
	y4:y + 12,
    }
    return new_quad;
}

function pythagoras(x,y){
  return Math.sqrt(x^2,y^2)
}

function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}