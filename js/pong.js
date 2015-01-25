/*global console */
var P1UP = 65, P1DOWN = 90, P2UP = 38, P2DOWN = 40;
var keys = {};
var canvas = document.getElementById("pong");
var ctx = canvas.getContext('2d');
var WIDTH = parseInt(canvas.getAttribute("width"), 10);
var HEIGHT = parseInt(canvas.getAttribute("height"), 10);
var score;
var skin = {
    paddle: '#C4B9A9',
    ball: '#9FFCB9',
    field: '#2E3340'
};

function Player(num, wide, moveUp, moveDown) {
    "use strict";
    this.num = num;
    this.moveUp = moveUp;
    this.moveDown = moveDown;
    this.wide = wide;
    this.score = 0;
    this.direction = undefined;
    this.x = this.num === 1 ? 20 : WIDTH - 30;
    this.y = HEIGHT / 2 - (this.wide / 2);
}
Player.prototype.draw = function () {
    "use strict";
    ctx.fillStyle = skin.paddle;
    ctx.fillRect(this.x, this.y, 10, this.wide);
};
Player.prototype.update = function () {
    "use strict";
    if (keys[this.moveUp]) { this.y -= 5; }
    if (keys[this.moveDown]) { this.y += 5; }
};
var p1 = new Player(1, 60, P1UP, P1DOWN);
var p2 = new Player(2, 60, P2UP, P2DOWN);

function Ball() {
    "use strict";
    this.x = WIDTH / 2 - 5;
    this.y = HEIGHT / 2 - 5;
    this.speed = 5;
    this.direction = {
        x: -1,
        y: 0
    };
}
Ball.prototype.draw = function () {
    "use strict";
    ctx.fillStyle = skin.ball;
    ctx.fillRect(this.x, this.y, 10, 10);
};
Ball.prototype.update = function () {
    "use strict";
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    
    if (this.y < 0 || (this.y + 10) > HEIGHT) {
        this.direction.y *= -1;
    }
    
    var normalized, angle;
    // p1 intersect
    if (this.y >= (p1.y - 10) && this.y <= (p1.y + p1.wide) && Math.abs(this.x - p1.x) < 10) {
        this.direction.x *= -1;
        normalized = (this.y - p1.y) / ((p1.x + p1.wide - 10) - p1.x);
        angle = 0.25 * Math.PI * (2 * normalized - 1);
        this.direction.x = Math.cos(angle);
        this.direction.y = Math.sin(angle);
    }
    // p2 intersect
    if (this.y >= (p2.y - 10) && this.y <= (p2.y + p2.wide) && Math.abs(this.x - p2.x) < 10) {
        this.direction.x *= -1;
        normalized = (this.y - p2.y) / ((p2.x + p2.wide - 10) - p2.x);
        angle = 0.25 * Math.PI * (2 * normalized - 1);
        this.direction.x = -Math.cos(angle);
        this.direction.y = Math.sin(angle);
    }
    
    if (this.x < 0) {               // p2 point
        this.x = WIDTH / 2 - 5;
        this.direction.x *= -1;
        p2.score += 1;
    } else if (this.x > WIDTH) {    // p1 point
        this.x = WIDTH / 2 - 5;
        this.direction.x *= -1;
        p1.score += 1;
    }
};
var ball = new Ball(ctx, WIDTH, HEIGHT);

function update() {
    "use strict";
    ball.update();
    p1.update();
    p2.update();
    score(p1.score, p2.score);
}

function draw() {
    "use strict";
    ctx.fillStyle = skin.field;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    ball.draw();
    p1.draw();
    p2.draw();
    
    ctx.restore();
}

function init() {
    "use strict";
    
    document.addEventListener("keydown", function (event) {
        keys[event.keyCode] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keys[event.keyCode];
    });
    
    var loop = function () {
        update();
        draw();
        window.requestAnimationFrame(loop, canvas);
    };
    window.requestAnimationFrame(loop, canvas);
    
}

init();