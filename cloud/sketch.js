var x = 1;
var y = 200;
var transparency = 100;
function setup(){
  createCanvas(800,800);
  background(21, 43, 53);
  noStroke();
  cloud(400,200,200,75,[58, 80, 89],getRandomNumber(-0.8,0.8),0.5);
  //cloud(700,100,180,60,[58, 80, 89],getRandomNumber(-1,1),0.7);
}

function draw(){
  /*if (transparency > 0){
    fill(70,200,70,transparency)
    ellipse(x, y, 50, 50)
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
      width : getRandomNumber(30,40),
      height : getRandomNumber(30,40),
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



function pythagoras(x,y){
  return Math.sqrt(x^2,y^2)
}

function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}

