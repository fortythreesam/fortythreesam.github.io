(function (){
    var width;
    var height;
	var universe = [];
	var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	var planet_resources = ["coal","iron","oil","gold"];
	
    document.addEventListener('DOMContentLoaded', init, false);
	
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
    }
    
	function generateGalaxy(){
		var galaxy = [];
		universe.push(galaxy);
	}
	
	function generateSolarSystem(){
		var num_planets = getRandomeNumber(1,5)+getRandomeNumber(0,4);
		var solar_system = {
			name: letters[getRandomNumber(0,25)]+letters[getRandomNumber(0,25)]+getRandomNumber(0,9)+getRandomNumber(0,9)+getRandomNumber(0,9),
			planets:[]
		}
		if (getRandomNumber(0,1) === 1){
			solar_system[planets].push(generatePlanet(1));
			num_planets -= 1
		}
		for (var i = 0; i < num_planets; i += 1){
			solar_system[planets].push(generatePlanet(0));
		}
		return solar_system
	}
	
	function generatePlanet(type){
		if (type === 0){
			var planet = {
				size : getRandomNumber(3500,300000),
				habitable : false,
				max_population : 0,
				resources : [],
				soil_fertility: getRandomNumber(1,100) / 100
			}
		}
		else if(type === 1){
		
		}
	}
	
    function getRandomNumber(min, max){
	    return Math.round(Math.random() * (max - min)) + min;
    }
  
})(); 