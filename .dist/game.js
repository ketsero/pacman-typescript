"use strict";
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
var pacmanFrames = document.getElementById("animation");
var ghostFrames = document.getElementById("ghosts");
function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}
var d_Right = 4;
var d_Up = 3;
var d_Left = 2;
var d_Bottom = 1;
var lives = 3;
var ghostCount = 4;
var ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];
// Game variables
var fps = 20;
var pacman;
var oneBlockSize = 20;
var score = 0;
var ghosts = [];
var wallSpaceWidth = oneBlockSize / 1.6;
var wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
var wallInnerColor = "black";
// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows
var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
var randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];
function createNewPacman() {
    pacman = new Pacman(oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5);
}
var gameLoop = function () {
    update();
    draw();
};
var gameInterval = setInterval(gameLoop, 1000 / fps);
function restartPacmanAndGhosts() {
    createNewPacman();
    createGhosts();
}
function onGhostCollision() {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
    }
}
var update = function () {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
};
var drawFoods = function () {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneBlockSize + oneBlockSize / 3, i * oneBlockSize + oneBlockSize / 3, oneBlockSize / 3, oneBlockSize / 3, "#FEB897");
            }
        }
    }
};
var drawRemainingLives = function () {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));
    for (var i = 0; i < lives; i++) {
        canvasContext.drawImage(pacmanFrames, 2 * oneBlockSize, 0, oneBlockSize, oneBlockSize, 350 + i * oneBlockSize, oneBlockSize * map.length + 2, oneBlockSize, oneBlockSize);
    }
};
var drawScore = function () {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1));
};
var draw = function () {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};
var drawWalls = function () {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, "#342DCA");
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(j * oneBlockSize, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                }
                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                }
                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                }
                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                }
            }
        }
    }
};
function createGhosts() {
    ghosts = [];
    for (var i = 0; i < ghostCount * 2; i++) {
        var newGhost = new Ghost(9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize, 10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize, oneBlockSize, oneBlockSize, pacman.speed / 2, ghostImageLocations[i % 4].x, ghostImageLocations[i % 4].y, 124, 116, 6 + i);
        ghosts.push(newGhost);
    }
}
createNewPacman();
createGhosts();
gameLoop();
window.addEventListener("keydown", function (event) {
    var k = event.keyCode;
    setTimeout(function () {
        if (k == 37 || k == 65) {
            pacman.nextDirection = d_Left;
        }
        else if (k == 38 || k == 87) {
            pacman.nextDirection = d_Up;
        }
        else if (k == 39 || k == 68) {
            pacman.nextDirection = d_Right;
        }
        else if (k == 40 || k == 83) {
            pacman.nextDirection = d_Bottom;
        }
    }, 1);
});
