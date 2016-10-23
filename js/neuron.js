var TrainElement = function(values, answer) {
    this.values = values;
    this.answer = answer;
}

var Neuron = function(n) {
    this.weights = [];
    this.step = 0.02;

    for (var i = 0; i < n; i++) {
        this.weights.push(1.0);
    }

    this.classify = function(input) {
        if (input.length > this.weights.length) {
            throw Error();
        }

        var sum = 0;
        for (var i = 0; i < this.weights.length; i++) {
            var inputValue = (i < input.length)? input[i] : 1.0;
            sum += input[i] * this.weights[i];
        }
        return sum / Math.abs(sum);
    }

    this.train = function(trainElement) {
        var actual = this.classify(trainElement.values);
        if (actual != trainElement.answer) {
            correctWeights(trainElement, actual);
        }
    }

    correctWeights = function(trainElement, answer) {
        var correction = this.step * (trainElement.answer - answer);
        for (var i = 0; i < this.weights.length; i++) {
            var inputValue = (i < trainElement.values.length)? trainElement.values[i] : 1.0;
            this.weights[i] += correction * inputValue;
            this.weights[i] = parseFloat(this.weights[i].toFixed(2));
        }
    }.bind(this);

    this.reset = function() {
        this.weights = [];
        for (var i = 0; i < n; i++) {
            this.weights.push(1.0);
        }
    }
}