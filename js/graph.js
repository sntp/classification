var Graph = function(id, size) {
    var colors = {
        RED: "#ff0000",
        BLUE: "#0000ff"
    };
    var showLine = true;

    this.reds = [];
    this.wrongReds = [];
    this.blues = [];
    this.wrongBlues = [];
    this.line = [];
    this.consecutiveInput = [];
    
    this.createPlot = function() {
        return $.plot(id, [
            {
                data: this.reds, 
                points: {
                    show: true
                },
                color: colors.RED
            },
            {
                data: this.wrongReds, 
                points: {
                    symbol: "cross",
                    show: true
                },
                color: colors.RED
            },
            { 
                data: this.blues, 
                points: {
                    show: true
                },
                color: colors.BLUE
            },
            {
                data: this.wrongBlues, 
                points: {
                    symbol: "cross",
                    show: true
                },
                color: colors.BLUE
            },
            { 
                data: this.line, 
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
    };
    
    this.plot = this.createPlot();
    
    this.update = function() {
        this.plot = this.createPlot();
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
        this.wrongReds = [];
        this.blues = [];
        this.wrongBlues = [];
        this.line = [];
        this.consecutiveInput = [];
    }

    this.addRed = function(x, y) {
        x = parseFloat(x.toFixed(2));
        y = parseFloat(y.toFixed(2));
        this.reds.push([x, y]);
        this.consecutiveInput.push({input: [x, y, 1.0], class: POINT_CLASS.RED});
    }
    
    this.addWrongRed = function(x, y) {
        x = parseFloat(x.toFixed(2));
        y = parseFloat(y.toFixed(2));
        this.wrongReds.push([x, y]);
        this.consecutiveInput.push({input: [x, y, 1.0], class: POINT_CLASS.RED});
    }

    this.addBlue = function(x, y) {
        x = parseFloat(x.toFixed(2));
        y = parseFloat(y.toFixed(2));
        this.blues.push([x, y]);
        this.consecutiveInput.push({input: [x, y, 1.0], class: POINT_CLASS.BLUE});
    }
    
    this.addWrongBlue = function(x, y) {
        x = parseFloat(x.toFixed(2));
        y = parseFloat(y.toFixed(2));
        this.wrongBlues.push([x, y]);
        this.consecutiveInput.push({input: [x, y, 1.0], class: POINT_CLASS.BLUE});
    }

    this.getShowLine = function() {
        return showLine;
    }

    this.setShowLine = function(val) {
        showLine = val;
        this.update();
    }
    
    this.highlight = function(x, y) {
        this.plot.unhighlight();
        for (var i = 0; i < this.reds.length; i++) {
            if (this.reds[i][0] == x && this.reds[i][1] == y) {
                this.plot.highlight(0, i);
                return;
            }
        }
        
        for (var i = 0; i < this.wrongReds.length; i++) {
            if (this.wrongReds[i][0] == x && this.wrongReds[i][1] == y) {
                this.plot.highlight(1, i);
                return;
            }
        }
        
        for (var i = 0; i < this.blues.length; i++) {
            if (this.blues[i][0] == x && this.blues[i][1] == y) {
                this.plot.highlight(2, i);
                return;
            }
        }
        
        for (var i = 0; i < this.wrongBlues.length; i++) {
            if (this.wrongBlues[i][0] == x && this.wrongBlues[i][1] == y) {
                this.plot.highlight(3, i);
                return;
            }
        }
        console.log("no highlight");
    }
}
