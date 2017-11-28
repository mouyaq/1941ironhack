window.onload = function() {
    document.getElementById("start-button").onclick = function() {
        startGame();
    }
}


function startGame() {
    var canvas = document.getElementById("game");
    canvas.width = 800;
    canvas.height = 600;
    // var ctx = canvas.msGetInputContext("2d");
    var game = new Game(canvas);
    game.draw();
}