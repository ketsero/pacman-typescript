"use strict";
var Pacman = /** @class */ (function () {
    function Pacman(x, y, width, height, speed) {
        var _this = this;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.nextDirection = 4;
        this.frameCount = 7;
        this.currentFrame = 1;
        setInterval(function () {
            _this.changeAnimation();
        }, 100);
    }
    Pacman.prototype.moveProcess = function () {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    };
    Pacman.prototype.eat = function () {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[0].length; j++) {
                if (map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i) {
                    map[i][j] = 3;
                    score++;
                }
            }
        }
    };
    Pacman.prototype.moveBackwards = function () {
        switch (this.direction) {
            case d_Right: // Right
                this.x -= this.speed;
                break;
            case d_Up: // Up
                this.y += this.speed;
                break;
            case d_Left: // Left
                this.x += this.speed;
                break;
            case d_Bottom: // Bottom
                this.y -= this.speed;
                break;
        }
    };
    Pacman.prototype.moveForwards = function () {
        switch (this.direction) {
            case d_Right: // Right
                this.x += this.speed;
                break;
            case d_Up: // Up
                this.y -= this.speed;
                break;
            case d_Left: // Left
                this.x -= this.speed;
                break;
            case d_Bottom: // Bottom
                this.y += this.speed;
                break;
        }
    };
    Pacman.prototype.checkCollisions = function () {
        var isCollided = false;
        if (map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize + 0.9999)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize + 0.9999)] == 1) {
            isCollided = true;
        }
        return isCollided;
    };
    Pacman.prototype.checkGhostCollision = function (ghosts) {
        for (var i = 0; i < ghosts.length; i++) {
            var ghost = ghosts[i];
            if (ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()) {
                return true;
            }
        }
        return false;
    };
    Pacman.prototype.changeDirectionIfPossible = function () {
        if (this.direction == this.nextDirection)
            return;
        var tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        }
        else {
            this.moveBackwards();
        }
    };
    Pacman.prototype.getMapX = function () {
        var mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    };
    Pacman.prototype.getMapY = function () {
        var mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    };
    Pacman.prototype.getMapXRightSide = function () {
        var mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    };
    Pacman.prototype.getMapYRightSide = function () {
        var mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    };
    Pacman.prototype.changeAnimation = function () {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    };
    Pacman.prototype.draw = function () {
        canvasContext.save();
        canvasContext.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2);
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        canvasContext.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2);
        canvasContext.drawImage(pacmanFrames, (this.currentFrame - 1) * oneBlockSize, 0, oneBlockSize, oneBlockSize, this.x, this.y, this.width, this.height);
        canvasContext.restore();
    };
    return Pacman;
}());
