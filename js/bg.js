function Bg(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.speed = 5;
}

Bg.prototype.draw = function() {
    this.sprite = new Image();
    this.sprite.src = "./images/bg/bg8.jpg";
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