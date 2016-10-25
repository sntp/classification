var POINT_CLASS = {
    RED: 1,
    BLUE: -1
};

var CLASS_NAME = {
    "1": "RED (1)",
    "-1": "BLUE (-1)"
};

var MODE = {
    TRAIN: "train",
    CLASSIFY: "classify"
};

var GraphManager = function(id) {
    var size = 10;
    this.graph = new Graph(id, size);
    this.neuron = new Neuron(3);
    this.mode = "train";
    this.currentClass = POINT_CLASS.RED;

    this.setMode = function(mode) {
        if (mode == MODE.TRAIN || mode == MODE.CLASSIFY) {
            this.mode = mode;
        } else {
            throw new Error("No such mode: " + mode);
        }
    }

    this.setClass = function(c) {
        if (c == POINT_CLASS.RED || c == POINT_CLASS.BLUE) {
            this.currentClass = c;
        } else {
            throw new Error("No such class: " + c);
        }
    }

    this.getShowLine = function() {
        return this.graph.getShowLine();
    }

    this.setShowLine = function(val) {
        this.graph.setShowLine(val);
    }

    this.train = function(x, y) {
        var input = [x, y, 1.0];
        this.neuron.train(new TrainElement(input, this.currentClass));
        var result = this.neuron.classify(input);
        if (this.currentClass == POINT_CLASS.RED) {
            if (result == POINT_CLASS.RED) {
                this.graph.addRed(x, y);
            } else {
                this.graph.addWrongRed(x, y);
            }
        } else if (this.currentClass == POINT_CLASS.BLUE) {
            if (result == POINT_CLASS.BLUE) {
                this.graph.addBlue(x, y);
            } else {
                this.graph.addWrongBlue(x, y);
            }
        } else {
            throw new Error("Unexpected class id");
        }
        updateLine();
    }

    updateLine = function() {
        var w1 = this.neuron.weights[0],
            w2 = this.neuron.weights[1],
            w3 = this.neuron.weights[2],
            y1 = 0.0,
            y2 = 1.0,
            x1 = -(w2*y1 + w3) / w1,
            x2 = -(w2*y2 + w3) / w1;
        this.graph.setLine(x1, y1, x2, y2);
    }.bind(this);

    this.classify = function(x, y) {
        var c = this.neuron.classify([x, y, 1.0]);
        if (c == POINT_CLASS.RED) {
            this.graph.addRed(x, y);
        } else if (c == POINT_CLASS.BLUE) {
            this.graph.addBlue(x, y);
        } else {
            throw new Error("Unexpected class was aquared from neuron: " + c);
        }
    }
    
    this.classifyWithWrongOnes = function(x, y, expectedClass) {
        var result = this.neuron.classify([x, y, 1.0]);
        if (expectedClass == POINT_CLASS.RED) {
            if (result == POINT_CLASS.RED) {
                this.graph.addRed(x, y);
             } else {
                this.graph.addWrongRed(x, y);
             } 
        } else if (expectedClass == POINT_CLASS.BLUE) {
            if (result == POINT_CLASS.BLUE) {
                this.graph.addBlue(x, y);
            } else {
                this.graph.addWrongBlue(x, y);
            }
        } else {
            throw new Error("Unexpected class was aquared from neuron: " + c);
        }
    }

    reclassify = function() {
        var reds = this.graph.reds.concat(this.graph.wrongReds);
        var blues = this.graph.blues.concat(this.graph.wrongBlues);
        
        this.graph.reset();
        for (var i = 0; i < reds.length; i++) {
            this.classifyWithWrongOnes(reds[i][0], reds[i][1], POINT_CLASS.RED);
        }
        
        for (var i = 0; i < blues.length; i++) {
            this.classifyWithWrongOnes(blues[i][0], blues[i][1], POINT_CLASS.BLUE);
        }
    }.bind(this);

    this.input = function(x, y) {
        if (this.mode == MODE.TRAIN) {
            this.train(x, y);
        } else if (this.mode == MODE.CLASSIFY) {
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
