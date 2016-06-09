(function (){
	var map = []
	var new_map = []
	var n = 0;
	var land_id = 0;
	var tiles;
	document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
		for (var i = 0; i < 250; i +=1){
			map.push([])
			new_map.push([])
			for(var j = 0; j < 200; j += 1){
				map[i].push(0)
				new_map[i].push(0)
			}
		}
	
		generateMap()
		draw()
    }
	
	function draw(){
		for (var i = 0; i < 250; i +=1){
			for (var j = 0; j < 200; j += 1){
				if (map[i][j] === 0) {
					context.fillStyle = "rgb("+grn(40,50)+","+grn(130,135)+","+grn(165,195)+")";
					context.fillRect(i*4,j*4,4,4);
				}
				else if (map[i][j] === -1){
					context.fillStyle = "#222222"
					context.fillRect(i*4,j*4,4,4);
				}
				else{
					context.fillStyle = "rgb("+((map[i][j]*1+grn(0,5)))+","+(255-((map[i][j]*4)+grn(0,5)))+","+((map[i][j]*3+grn(0,5)))+")";
					context.fillRect(i*4,j*4,4,4);
				}
			}
		}
	}
	
	function generateMap(){
		//adding single pixel lands
		for(var n = 1; n < 30; n += 1){
			var mid_x = grn(30,220);
			var mid_y = grn(30,170);
			for (var i = mid_x - 5; i < mid_x + 5; i += 1){
				for (var j = mid_y - 8; j < mid_y + 8; j += 1){
					map[i][j] = n+100
				}
			}
		}
		//growing the lands
		for (var n = 0; n < 23; n += 1){
			if (n < 17 && n > 1){
				for(var x = 0; x < n; x += 1){
					var empty_x = grn(15,235)
					var empty_y = grn(15,185)
					for (var a = empty_x - grn(5,15);a < empty_x + grn(5,15);a += 1){
						for (var b = empty_y - grn(5,15);b < empty_y + grn(5,15);b += 1){
							map[a][b] = 0
						}
					}
				}
			}
			for (var i = 2; i < 248; i +=1){
				for (var j = 2; j < 198; j += 1){
					if (map[i][j] > 0){
						new_map[i][j] = map[i][j]
						if (checkSurrounding(i,j)){
							var keepgoing = true;
							while (keepgoing){
								var check_x = grn(i-1,i+1);
								var check_y = grn(j-1,j+1);
								if (map[check_x][check_y] === 0){
									new_map[check_x][check_y] = map[i][j];
									keepgoing = false;
								}
							}
						}
					}
				}
			}
			map = new_map
			
			new_map = []
			for (var i = 0; i < 250; i +=1){
				new_map.push([])
				for(var j = 0; j < 200; j += 1){
					new_map[i].push(0)
				}
			}
		}
		for (var n = 0; n < 5; n += 1){
			for (var i = 1; i < 249; i +=1){
				for (var j = 1; j < 199; j += 1){
					if (map[i][j] > -1){
						if (checkNeighbours(i,j) <= 2){
							if (map[i][j] !== map[i-1][j]){
								map[i][j] = map[i-1][j]
							}
							else if (map[i][j] !== map[i+1][j]){
								map[i][j] = map[i+1][j]
							}
							else if (map[i][j] !== map[i][j-1]){
								map[i][j] = map[i][j-1]
							}
							else if (map[i][j] !== map[i][j+1]){
								map[i][j] = map[i][j+1]
							}
						}
					}
				}
			}
		}
		//adding borders
		for (var i = 1; i < 249; i +=1){
			for (var j = 1; j < 199; j += 1){
				if (map[i][j] > 0){
					if (checkBorders(i,j) < 3){
						new_map[i][j] = -1;
					}
					else{
						new_map[i][j] = map[i][j]
					}
				}
			}
		}
		map = new_map
		
		//removing single bits of land
		for (var n = 0; n < 5; n += 1){
			for (var i = 1; i < 249; i +=1){
				for (var j = 1; j < 199; j += 1){
					if (map[i][j] > -1){
						if (checkNeighbours(i,j) <= 2){
							if (map[i][j] !== map[i-1][j]){
								map[i][j] = map[i-1][j]
							}
							else if (map[i][j] !== map[i+1][j]){
								map[i][j] = map[i+1][j]
							}
							else if (map[i][j] !== map[i][j-1]){
								map[i][j] = map[i][j-1]
							}
							else if (map[i][j] !== map[i][j+1]){
								map[i][j] = map[i][j+1]
							}
						}
					}
				}
			}
		}
		//reasigning numbers to land
		for (var j = 1; j < 199; j +=1){
			for (var i = 1; i < 249; i += 1){
				if (map[i][j] > 90){
					tiles = 0
					land_id += 1
					floodfill(i,j,map[i][j]);
					if (tiles < 200){
						for (var x = 1; x < 249; x +=1){
							for (var y = 1; y < 199; y += 1){
								if (map[x][y] === land_id){
									map[x][y] = 0;
								}
							}
						}
					}
				}
			}
		}
		for (var n = 0; n < 5; n += 1){
			for (var i = 1; i < 249; i +=1){
				for (var j = 1; j < 199; j += 1){
					if (map[i][j] === -1){
						var remove = true;
						for (var a = i-1 ;a < i+2; a += 1){
							for (var b = j-1 ;b < j+2; b += 1){
								if (map[a][b] !== 0 && map[a][b] !== -1){
									remove = false;
								}
							}
						}
						if (remove){
							map[i][j] = 0;
						}
					}
				}
			}
		}
	}
	
	function floodfill(x,y,number){
		if (map[x][y] === number){
			map[x][y] = land_id;
			tiles += 1
			floodfill(x+1,y,number)
			floodfill(x-1,y,number)
			floodfill(x,y+1,number)
			floodfill(x,y-1,number)
		}
	}
	
	function checkSurrounding(x,y){
		var total = 0
		for (var a = x-1 ;a < x+2; a += 1){
			for (var b = y-1 ;b < y+2; b += 1){
				if (map[a][b] === 0){
					return true
				} 
			}
		}
		return false
	}
	
	function checkNeighbours(x,y){
		var total = -1
		for (var a = x-1 ;a < x+2; a += 1){
			for (var b = y-1 ;b < y+2; b += 1){
				if (map[a][b] === map[x][y] || new_map[a][b] === -1 ){
					total += 1
				}
			}
		}
		return total			
	}
	
	function checkBorders(x,y){
		var total = -1
		if (map[x+1][y] === map[x][y] || new_map[x+1][y] === -1 ){
				total += 1
		}
		if (map[x-1][y] === map[x][y] || new_map[x-1][y] === -1 ){
				total += 1
		}
		if (map[x][y+1] === map[x][y] || new_map[x][y+1] === -1 ){
				total += 1
		}
		if (map[x][y-1] === map[x][y] || new_map[x][y-1] === -1 ){
				total += 1
			}
		return total			
	}
	
	function doesntContain(item, array){
		for (var i = 0; i < array.length; i += 1){
			if (item === array[i]){
				return true
			}
		}
		return false
	}
	
    function grn(min, max) {
		return Math.floor(Math.random() * (max - min+1)) + min;
    }
  

})(); 
