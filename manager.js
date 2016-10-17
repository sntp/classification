var POINT_CLASS = {
    RED: 1,
    BLUE: -1
};

var MODE = {
    TRAIN: "train",
    CLASSIFY: "classify"
};

var GraphManager = function(id) {
    var classes = {
        red: 1,
        blue: -1
    };
    this.RED = classes.red;
    this.BLUE = classes.blue;
    var size = 10;
    this.graph = new Graph(id, size);
    this.neuron = new Neuron(3);
    this.mode = "train";
    this.currentClass = classes.red;

    this.setMode = function(mode) {
        if (mode == "train" || mode == "classify") {
            this.mode = mode;
        } else {
            throw new Error();
        }
    }

    this.setClass = function(c) {
        if (c == classes.red || c == classes.blue) {
            this.currentClass = c;
        } else {
            throw new Error();
        }
    }

    this.getShowLine = function() {
        return this.graph.getShowLine();
    }

    this.setShowLine = function(val) {
        this.graph.setShowLine(val);
    }

    this.train = function(x, y) {
        this.neuron.train(new TrainElement([x, y, 1.0], this.currentClass));
        if (this.currentClass == classes.red) {
            this.graph.addRed(x, y);
        } else if (this.currentClass == classes.blue) {
            this.graph.addBlue(x, y);
        } else {
            throw new Error();
        }
        updateLine();
    }

    updateLine = function() {
        var w1 = this.neuron.weights[0],
            w2 = this.neuron.weights[1],
            w3 = this.neuron.weights[2],
            y1 = 0.0,
            y2 = 1.0,
            x1 = -(w2*y1 + w3)/w1,
            x2 = -(w2*y2 + w3)/w1;
        this.graph.setLine(x1, y1, x2, y2);
    }.bind(this);
    updateLine();

    this.classify = function(x, y) {
        var c = this.neuron.classify([x, y, 1.0]);
        if (c == classes.red) {
            this.graph.addRed(x, y);
        } else if (c == classes.blue) {
            this.graph.addBlue(x, y);
        } else {
            throw new Error("No such class " + c);
        }
    }

    reclassify = function() {
        var points = this.graph.reds.concat(this.graph.blues);
        this.graph.reset();
        for (var i = 0; i < points.length; i++) {
            this.classify(points[i][0], points[i][1]);
        }
    }.bind(this);

    this.input = function(x, y) {
        if (this.mode == "train") {
            this.train(x, y);
        } else if (this.mode == "classify") {
            this.classify(x, y);
        }
    }

    this.update = function() {
        reclassify();
        updateLine();
        this.graph.update();
    }

    this.reset = function() {
        this.graph.reset();
        this.neuron.reset();
        this.update();
    }
}