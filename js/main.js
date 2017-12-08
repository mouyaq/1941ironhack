window.onload = function() {
    document.getElementById("start-button").onclick = function() {
        document.getElementById("intro").remove();
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
    var audioTutorial = new Audio("./sounds/ik0.mp3");
    audioTutorial.volume = 0.1;
    var audio = new Audio("./sounds/ik1_loop.mp3");
    audio.volume = 0.1;
    audio.loop = "loop";
    audioTutorial.play();
    setTimeout(function() {
        audio.play();
    }, 23000);
    game.draw("play");
}