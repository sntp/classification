var Graph = function(id, size) {
    var colors = {
        RED: "#ff0000",
        BLUE: "#0000ff"
    };
    var showLine = true;

    this.reds = [];
    this.blues = [];
    this.line = [];
    this.plot = $.plot(id, [
        {
            data: [], 
            points: {
                show: true
            }
        },
        {
            data: [], 
            points: {
                show: true
            }
        },
        {
            data: [], 
            lines: {
                show: showLine
            }
        }], 
        { 
            grid: {
                hoverable: true,
                clickable: true
            },
            yaxis: {
                min: -size,
                max: size
            },
            xaxis: {
                min: -size,
                max: size
            }
        });

    this.update = function() {
        this.plot.setData([
            {
                data: this.reds, 
                points: {
                    show: true
                }
            },
            { 
                data: this.blues, 
                points: {
                    show: true
                }
            },
            { 
                data: this.line, 
                lines: {
                    show: showLine
                }
            }
        ]);
        this.plot.draw();
    }

    this.setLine = function(x1, y1, x2, y2) {
        if (x1 == x2) {
            this.line = [[x1, -size], [x2, size]];
        } else if (y1 == y2) {
            this.line = [[-size, y1], [size, y2]];
        } else {
            yh = (size - x1) * (y2 - y1) / (x2 - x1) + y1;
            yl = (-size - x1) * (y2 - y1) / (x2 - x1) + y1;
            this.line = [[size, yh], [-size, yl]];
        }
    }

    this.reset = function() {
        this.reds = [];
        this.blues = [];
        this.line = [];
    }

    this.addRed = function(x, y) {
        this.reds.push([x, y]);
    }

    this.addBlue = function(x, y) {
        this.blues.push([x, y]);
    }

    this.getShowLine = function() {
        return showLine;
    }

    this.setShowLine = function(val) {
        showLine = val;
        this.update();
    }
}