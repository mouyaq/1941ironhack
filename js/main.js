window.onload = function() {
    document.getElementById("start-button").onclick = function() {
        startGame();
    }
}


function startGame() {
    var canvas = document.getElementById("game");
    var game = new Game(canvas);
    canvas.height = 800;
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = 800;
        
    }
    resizeCanvas();
    // canvas.width = "100%";
    // canvas.height = "800px";
    // var ctx = canvas.msGetInputContext("2d");
    game.draw();
    
}