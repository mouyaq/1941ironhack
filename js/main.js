window.onload = function() {
    $("#gameover").hide();
    document.getElementById("start-button").onclick = function() {
        $("#intro").hide();
        //document.getElementById("intro").remove();
        var players = document.getElementById("ps").value;
        var dificult = document.getElementById("ds").value;
        startGame(players, dificult);
    }
}

function startGame(players, dificult) {
    var canvas = document.getElementById("game");
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    var game = new Game(canvas, players, dificult);
    //game.started();
    game.draw();
}