let liveCellColor = "#666666";
let deadCellColor = "#eeeeee";

function SVG(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

class OneDimensionCellularAutomation {
    constructor(width, cellWidth, canvas) {
        this.width = width;
        this.cellWidth = cellWidth;
        this.canvas = canvas;
        this.cells = new Array();
        this.initial();
        this.reset();
    }
    initial() {
        this.canvas.attr("width", this.width * this.cellWidth).attr("height", this.cellWidth);
        for(let i = 0; i < this.width; ++i) {
            let cell = SVG('rect');
            $(cell).attr("width", this.cellWidth).attr("height", this.cellWidth).attr("x", i * this.cellWidth).attr("y", 0).attr("class", "wall");
            this.cells.push($(cell));
           this.canvas.append(cell);
        }
    }

    reset() {
        this.cells.forEach(function(item) {
            item.attr("class", "wall");
        })
        for(let i = 0; i < this.width; ++i) {
            let index = Math.round(Math.random() * (this.width - 1));
            this.cells[index].attr("class", "ground");
        }
    }

    nextGeneration() {
        let cells = this.cells;
        this.cells.forEach(function(item, index) {
            let left = false;
            if(cells[index - 1] && cells[index - 1].attr("class") == 'ground')
                left = true;
            let right = false;
            if(cells[index + 1] && cells[index + 1].attr("class") == 'ground')
                right = true;
            if(left && right)
                item.attr("class", "wall");
            else if(!left && !right)
                item.attr("class", 'wall');
            else
                item.attr("class", 'ground');
        })
    }
}

class TwoDimensionCellularAutomation {
    constructor(width, height, cellWidth, canvas) {
        this.width = width;
        this.height = height;
        this.cellWidth = cellWidth;
        this.canvas = canvas;
        this.cells = new Array();
        this.initial();
        this.reset();
    }

    initial() {
        this.canvas.attr("width", this.width * this.cellWidth).attr("height", this.height * this.cellWidth);
        for(let i = 0; i < this.height; ++i) {
            this.cells.push(new Array());
            for(let j = 0; j < this.width; ++j) {
                let cell = SVG('rect');
                $(cell).attr("width", this.cellWidth).attr("height", this.cellWidth).attr("x", j * this.cellWidth).attr("y", i * this.cellWidth).attr("class", "wall");
                this.cells[i].push($(cell));
                this.canvas.append(cell);
            }
        }
    }

    reset() {
        let width = this.width;
        let height = this.height;
        this.cells.forEach(function(row, j) {
            row.forEach(function(item, i) {
                if(i == 0 || i == width - 1 || j == 0 || j == height - 1)
                    item.attr("class", "wall");
                else {
                    item.attr("class", "wall");
                    let random = Math.random();
                    if( random > 0.45)
                        item.attr("class", "ground");
                }
            })
        });
    }

    nextGeneration() {
        let result = new Array();
        for(let i = 0; i < this.height; ++i) {
            result.push(new Array());
            for(let j = 0; j < this.width; ++j) {
               result[i].push(this.shouldBeWall(this.cells, j, i));
            }
        }
        for(let i = 1; i < this.height-1; ++i) {
            for(let j = 1; j < this.width-1; ++j) {
                this.cells[i][j].attr("class", result[i][j] ? "wall" : "ground");
            }
        }

    }

    shouldBeWall(cells, x, y) {
        let around = 0;
        let aroundCells = new Array();
        if(cells[y - 1]) {
            aroundCells.push(cells[y - 1][x]);
            aroundCells.push(cells[y - 1][x + 1]);
            aroundCells.push(cells[y - 1][x - 1]);
        }
        if(cells[y + 1]) {
            aroundCells.push(cells[y + 1][x]);
            aroundCells.push(cells[y + 1][x - 1]);
            aroundCells.push(cells[y + 1][x + 1]);
        }
        aroundCells.push(cells[y][x - 1]);
        aroundCells.push(cells[y][x + 1]);
        aroundCells.forEach(function(item) {
            if(item && item.attr("class") == "wall") {
                around++;
            }
        })
        console.log(x + " " + y + " " + around);
        if(cells[y][x].attr("class") == "wall") {
            if(around >= 4)
                return true;
            else
                return false;
        } else {
            if(around >= 5)
                return true;
            else
                return false;
        }
    }
}

$(function () {
    let oneDimension = new OneDimensionCellularAutomation(20, 10, $("#one_dimension_cellular"));
    $("#one_dimension_initial").click(function() {
        oneDimension.reset();
    });
    $('#one_dimension_next').click(function() {
        oneDimension.nextGeneration();
    });

    let twoDimension = new TwoDimensionCellularAutomation(30, 30, 15, $("#two_dimension_cellular"));

    $("#two_dimension_initial").click(function() {
        twoDimension.reset();
    });

    $('#two_dimension_next').click(function() {
        twoDimension.nextGeneration();
    });

    $("#test").click(function() {
        $("#rect").attr("fill", "#ff0000");
    });
});
