"use strict";
var Ghost = /** @class */ (function () {
    function Ghost(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        var _this = this;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = d_Right;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(function () {
            _this.changeRandomDirection();
        }, 10000);
    }
    Ghost.prototype.isInRange = function () {
        var xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        var yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range) {
            return true;
        }
        return false;
    };
    Ghost.prototype.changeRandomDirection = function () {
        var addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    };
    Ghost.prototype.moveProcess = function () {
        if (this.isInRange()) {
            this.target = pacman;
        }
        else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    };
    Ghost.prototype.moveBackwards = function () {
        switch (this.direction) {
            case 4: // Right
                this.x -= this.speed;
                break;
            case 3: // Up
                this.y += this.speed;
                break;
            case 2: // Left
                this.x += this.speed;
                break;
            case 1: // Bottom
                this.y -= this.speed;
                break;
        }
    };
    Ghost.prototype.moveForwards = function () {
        switch (this.direction) {
            case 4: // Right
                this.x += this.speed;
                break;
            case 3: // Up
                this.y -= this.speed;
                break;
            case 2: // Left
                this.x -= this.speed;
                break;
            case 1: // Bottom
                this.y += this.speed;
                break;
        }
    };
    Ghost.prototype.checkCollisions = function () {
        var isCollided = false;
        if (map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize + 0.9999)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize + 0.9999)] == 1) {
            isCollided = true;
        }
        return isCollided;
    };
    Ghost.prototype.changeDirectionIfPossible = function () {
        var tempDirection = this.direction;
        this.direction = this.calculateNewDirection(map, parseInt(this.target.x / oneBlockSize), parseInt(this.target.y / oneBlockSize));
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (this.getMapY() != this.getMapYRightSide() &&
            (this.direction == d_Left || this.direction == d_Right)) {
            this.direction = d_Up;
        }
        if (this.getMapX() != this.getMapXRightSide() &&
            this.direction == d_Up) {
            this.direction = d_Left;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        }
        else {
            this.moveBackwards();
        }
        console.log(this.direction);
    };
    Ghost.prototype.calculateNewDirection = function (map, destX, destY) {
        var mp = [];
        for (var i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }
        var queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            var poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            }
            else {
                mp[poped.y][poped.x] = 1;
                var neighborList = this.addNeighbors(poped, mp);
                for (var i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }
        return 1; // direction
    };
    Ghost.prototype.addNeighbors = function (poped, mp) {
        var queue = [];
        var numOfRows = mp.length;
        var numOfColumns = mp[0].length;
        if (poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1) {
            var tempMoves = poped.moves.slice();
            tempMoves.push(d_Left);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1) {
            var tempMoves = poped.moves.slice();
            tempMoves.push(d_Right);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1) {
            var tempMoves = poped.moves.slice();
            tempMoves.push(d_Up);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1) {
            var tempMoves = poped.moves.slice();
            tempMoves.push(d_Bottom);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    };
    Ghost.prototype.getMapX = function () {
        var mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    };
    Ghost.prototype.getMapY = function () {
        var mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    };
    Ghost.prototype.getMapXRightSide = function () {
        var mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    };
    Ghost.prototype.getMapYRightSide = function () {
        var mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    };
    Ghost.prototype.changeAnimation = function () {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    };
    Ghost.prototype.draw = function () {
        canvasContext.save();
        canvasContext.drawImage(ghostFrames, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.x, this.y, this.width, this.height);
        canvasContext.restore();
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2, this.range * oneBlockSize, 0, 2 * Math.PI);
        canvasContext.stroke();
    };
    return Ghost;
}());
var updateGhosts = function () {
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};
var drawGhosts = function () {
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
