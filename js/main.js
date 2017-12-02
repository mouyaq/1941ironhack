window.onload = function() {
    document.getElementById("start-button").onclick = function() {
        startGame();
    }
}


function startGame() {
    var canvas = document.getElementById("game");
    var game = new Game(canvas);
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
    }
    resizeCanvas();
    game.draw();
    
}