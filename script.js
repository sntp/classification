var TrainElement = function(values, answer) {
    this.values = values;
    this.answer = answer;
}

var Neuron = function(n) {
    this.weights = [];
    this.step = 0.2;

    for (var i = 0; i < n; i++) {
        this.weights.push(1);
    }

    this.classify = function(input) {
        if (input.length > this.weights.length) {
            throw Error();
        }

        var sum = 0;
        for (var i = 0; i < this.weights.length; i++) {
            var inputValue = (i < input.length)? input[i] : 1;
            sum += input[i] * this.weights[i];
        }
        return sum / Math.abs(sum);
    }

    this.train = function(trainElement) {
        var actual = this.classify(trainElement.values);
        if (actual != trainElement.answer) {
            correctWeights(trainElement, actual);
        }
        console.log(this.weights);
    }

    correctWeights = function(trainElement, answer) {
        var correction = this.step * (trainElement.answer - answer);
        for (var i = 0; i < this.weights.length; i++) {
            var inputValue = (i < trainElement.values.length)? trainElement.values[i] : 1;
            this.weights[i] += correction * inputValue;
        }
    }.bind(this);
}

var Graph = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.points = [];
    this.line = [];

    var pictureFrame = function() {
        var minY = Number.MAX_VALUE, 
            maxY = -Number.MAX_VALUE, 
            minX = Number.MAX_VALUE, 
            maxX = -Number.MAX_VALUE;
        for (point in this.points) {
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
        }
        return ({maxX: maxX, minX: minX, maxY: maxY, minY: minY});
    }.bind(this);

    var translate = function(point, pictureFrame) {
        
    }

    this.draw = function() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        pictureFrame = pictureFrame();
        width = pictureFrame.maxX - pictureFrame.minX;
        height = pictureFrame.maxY - pictureFrame.minY;
        for (point in this.points) {
            ctx.arc(point.x, y, radius, startAngle, endAngle, anticlockwise)
        }
    }
}

var importButton = document.getElementById("import");
var exportButton = document.getElementById("export");
var beginButton = document.getElementById("begin");

var graphCanvas = document.getElementById("graph-canvas");
var neuronCanvas = document.getElementById("neuron-canvas");
var graphCtx = graphCanvas.getContext('2d');
var neuronCtx = neuronCanvas.getContext('2d');

importButton.onclick = function () {
    alert('GO!');
}

var neuron = new Neuron(3);
neuron.train(new TrainElement([1, 1, 1], 1));
neuron.train(new TrainElement([9.4, 6.4, 1], -1));
