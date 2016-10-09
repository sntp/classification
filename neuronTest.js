var assertEquals = function(actual, expected) {
    var eps = 0.001
    var equals = false;

    if (actual instanceof Array && expected instanceof Array) {
        equals = (expected.length == actual.length) && expected.every(function(element, index) {
            return Math.abs(element - actual[index]) < eps; 
        });
    } else {
        equals = actual == expected;
    }

    if (!equals) {
        throw "Assertation error:\n expected: " + expected + "\nactual: " + actual
    }
}

var trainingProcessTest = function() {
    var neuron = new Neuron(3);
    assertEquals(neuron.weights, [1.0, 1.0, 1.0]);

    neuron.weights = [0.75, 0.5, -0.6];
    neuron.train(new TrainElement([1.0, 1.0, 1.0], 1));
    assertEquals(neuron.weights, [0.75, 0.5, -0.6]);

    neuron.train(new TrainElement([9.4, 6.4, 1.0], -1));
    assertEquals(neuron.weights, [-3.01, -2.06, -1.0]);

    neuron.train(new TrainElement([2.5, 2.1, 1.0], 1));
    assertEquals(neuron.weights, [-2.01, -1.22, -0.6]);

    console.log('trainingProcessTest: TEST PASSED!');
}

var neuronTest = function() {
    var trainingSet = [
        new TrainElement([1.0, 1.0, 1.0], 1),
        new TrainElement([9.4, 6.4, 1.0], -1),
        new TrainElement([2.5, 2.1, 1.0], 1),
        new TrainElement([8.0, 7.7, 1.0], -1),
        new TrainElement([0.5, 2.2, 1.0], 1),
        new TrainElement([7.9, 8.4, 1.0], -1),
        new TrainElement([7.0, 7.0, 1.0], -1),
        new TrainElement([2.8, 0.8, 1.0], 1),
        new TrainElement([1.2, 3.0, 1.0], 1),
        new TrainElement([7.8, 6.1, 1.0], -1)
    ];
    var neuron = new Neuron(3);
    trainingSet.forEach(function (trainElement) {
        neuron.train(trainElement);
    });

    assertEquals(neuron.classify([-0.5, -0.7, 1.0]), 1);
    assertEquals(neuron.classify([10.3, 15.3, 1.0]), -1);
    console.log('neuronTest: TEST PASSED!');
}

document.addEventListener( 'DOMContentLoaded', function () {
    trainingProcessTest();
    neuronTest();
}, false);
