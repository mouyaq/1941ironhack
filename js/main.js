window.onload = function() {
    document.getElementById("start-button").onclick = function() {
        startGame();
    }
}


function startGame() {
    var canvas = document.getElementById("game");
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
    }
    resizeCanvas();
    var game = new Game(canvas);
    var audio = new Audio("./sounds/ik1.mp3");
    audio.volume = 0.1;
    audio.loop = "loop";
    game.draw();
    audio.play();
    
    /* Option with set interval
    setInterval(function(){
        game.draw()
    }, 1000/60);
    */
    
}