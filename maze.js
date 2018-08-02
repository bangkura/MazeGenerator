var maze_height = 1000;
var maze_width = 1000;

class Maze {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.rooms = [];

        this.fill();

        this.addRoom();

    }

    fill() {
        this.maze = new Array(this.height);
        for(let i = 0; i < this.height; ++i) {
            this.maze[i] = new Array(this.width);
            for(let j = 0; j < this.width; ++j) {
                this.maze[i][j] = new Ground(j, i);
            }
        }
    }

    addRoom() {
        for(let i = 0; i < 100; ++i) {
            let x = Math.round(Math.random() * this.width);
            let y = Math.round(Math.random() * this.height);
            let width = Math.round(Math.random() * 10 + 10);
            let height = Math.round(Math.random() * 10 + 10);

            if(x + width > this.width || y + height > this.height)
                continue;

            let room = new Room(x, y, height, width);
            let isOverlaped = false;
            this.rooms.forEach(function(otherRoom) {
                if(room.isOverlap(otherRoom))
                    isOverlaped = true;
            })

            if(isOverlaped)
                continue;

            this.rooms.push(room);
            console.log(this.rooms);
        }
    }

    draw() {
        for(let i = 0; i < this.height; ++i) {
            for(let j = 0; j < this.width; ++j) {
                this.maze[i][j].draw();
            }
        }
        this.rooms.forEach(function(room) {
            console.log("drawing the room:" + room.x + " " + room.y)
            room.draw();
        })
    }
}

class Tile {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        let myCanvas =  $('.show_case');
        myCanvas.drawRect( {
            fillStyle: this.color,
            x: this.x * 10, y: this.y * 10,
            fromCenter: false,
            width: 10,
            height: 10
        });
    }
}

class Room {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.tiles = new Array(height);
        for(let i = 0; i < height; ++i) {
            this.tiles[i] = new Array(width);
            for(let j = 0; j < width; ++j) {
                this.tiles[i][j] = new Wall(x + j, y + i);
            }
        }
    }

    isOverlap(otherRoom) {
        return (this.x < otherRoom.x + otherRoom.width && this.x + this.width > otherRoom.x) && (this.y < otherRoom.y + otherRoom.height && this.y + this.height > otherRoom.y);
    }

    draw() {
        for(let i = 0; i < this.height; ++i) {
            for(let j = 0; j < this.width; ++j) {
                this.tiles[i][j].draw();
            }
        }
    }
}

class Ground extends Tile{
    constructor(x, y) {
        super(x, y, "steelblue");
    }
}

class Wall extends Tile{
    constructor(x, y) {
        super(x, y, "white");
    }
}

$(function() {
    $(".show_case").attr('width', maze_width).attr("height", maze_height);

    maze = new Maze(100, 100);
    maze.draw();
    console.log(maze);
});