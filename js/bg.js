function Bg(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.speed = 0;
}

Bg.prototype.draw = function(bgNumber) {
    this.sprite = new Image();
    // document.getElementById("background").value
    var bgFile;
    switch(bgNumber) {
        case 0:
            this.game.actualBg = bgNumber;
            bgFile = "tutorial-min.png";
            this.speed = 3;
            break;
        case 1:
            this.game.actualBg = bgNumber;
            bgFile = "bg13b-min.png";
            this.speed = 5;
            break;
        case 2:
            this.game.actualBg = bgNumber;
            bgFile = "bg12.png";
            this.speed = 7;
            break;
        case 3:
            this.game.actualBg = bgNumber;
            bgFile = "bg14c.png";
            this.speed = 9;
            break;
        case 4:
            this.game.actualBg = bgNumber;
            bgFile = "bg16b-min.jpg";
            this.speed = 11;
            break;
        case 5:
            this.game.actualBg = bgNumber;
            bgFile = "bg17-min.jpg";
            this.speed = 13;
            break;
    }
    var bgFilePath = "./images/bg/" + bgFile;
    this.sprite.src = bgFilePath;
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.sprite.onload = function() {
        if(this.y >= this.height) {
            this.y = 0;
        }
        this.ctx.clearRect(0,0,this.width, this.height);
        this.ctx.drawImage(this.sprite, this.x, this.y);
        this.ctx.drawImage(this.sprite, this.x, this.y - this.height);
    }.bind(this);
    this.y += this.speed;
}