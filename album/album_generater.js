(function (){
  
	document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
		canvas.width = 1000;
		canvas.height = 400;
        var num_albums = albums.length;
		var album = grn(0,num_albums-1);
		console.log(artists[136] + " - " + albums[136])
		context.fillStyle = "#cccccc"
		context.font = "40px Ariel"
		context.textAlign = "center"
		context.fillText("Number of albums left:" + num_albums,500,150);
		context.fillText(artists[album] + " - " + albums[album],500,250);
	}
	
    function grn(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
    }
  

})(); 