(function(){
  var universe = []
  var size_of_universe = 10;
  var size_of_galaxy = 100;
  var size_of_solarsystem = 50;
  var sizes = ["xxs","xs","s","m","l","xl","xxl"];

  function init(){
    generate_universe();
  }

  function generate_universe(){
    for(var i = 0; i < size_of_universe; 1 ++){
      universe.push([]);
      for(var j = 0; j < size_of_universe; j ++){
        universe[i].push(0);
      }
    }
    universe[grn(0,size_of_universe)][grn(0,size_of_universe)] = generate_galaxy();
  }

  function generate_galaxy(){
	galaxy = [];
	for(var i = 0; i < size_of_galaxy; i ++;){
	  galaxy.push([]);
	  for(var j = 0; j < size_of_galaxy; j ++;){
		universe.push(0);
	  }
	}
	galaxy[grn(0,size_of_galaxy)][grn(0,size_of_galaxy)] = generate_solarsystem();
	return galaxy;
  }
  
  function generate_solarsystem(){
    solarsystem = [];
	for(var i = 0; i < size_of_solarsystem; i ++;){
	  galaxy.push([])
	  for(var j = 0; j < size_of_solarsystem; j ++;){
		universe.push(0);
	  }
	}
	solarsystem[25][25] = generate_star();
	solarsystem[grn(0,size_of_solarsystem)][grn(0,size_of_solarsystem)] = generate_planet();
	return solarsystem;
  }
  
  function generate_star(){
	
  }
  
  function generate_planet(){
  
  }

  function grn(min, max){
    return Math.floor(Math.random() * (max - min+1)) + min;
  }
 
}())
