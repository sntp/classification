const BLUE_CLASS = "btn-info",
      RED_CLASS = "btn-danger",
      INVISIBLE_CLASS = "invisible",
      ACTIVE_CLASS = "active";

var trainingScreen = $("#training-screen"),
    visualScreen = $("#visual-screen"),
    trainGraph = $("#train-graph"),
    visualGrapg = $("#visual-graph"),
    tooltip = $("#tooltip"),
    redButton = $("#red-class"),
    blueButton = $("#blue-class"),
    tooltip = $("#tooltip"),
    resetButton = $("#reset"),
    goToTrainingButton = $("#train"),
    tableContainer = $("#steps"),
    stepSlider = $("#step"),
    stepBadge = $("#step-size")
    again = $("#again");

const GRAPH_SIZE = 10;
var graph = new Graph("#train-graph", GRAPH_SIZE);
var graphManager = new GraphManager("#visual-graph");
var table = new Table();
var currentPointClass = POINT_CLASS.RED;

var trainingInit = function () {
    try {
        if (currentPointClass == POINT_CLASS.RED) {
            redButton.click();
        } else if (currentPointClass == POINT_CLASS.BLUE) {
            blueButton.click();
        } else {
            throw new Error("INITIALIZATION ERROR: Unknown class '" + currentClass + "'");
        }
        stepSlider.val(graphManager.neuron.step);
        stepSlider.change();
    } catch(e) {
        alert(e);
    }
}

$(document).ready(trainingInit);

$(window).resize(function () {
    graph.update();
    graphManager.update();
});

trainGraph.bind("plotclick", function (event, pos, item) {
    try {
        if (currentPointClass == POINT_CLASS.RED) {
            graph.addRed(pos.x, pos.y);
        } else if (currentPointClass == POINT_CLASS.BLUE) {
            graph.addBlue(pos.x, pos.y);
        } else {
            throw new Error("Unknown class '" + currentClass + "'");
        }
        graph.update();
    } catch(e) {
        alert(e);
    }
});

$(".graph").bind("plothover", function (event, pos, item) {
    if (item) {
        var x = item.datapoint[0],
            y = item.datapoint[1];

        tooltip.html("X: " + x + ", Y: " + y)
            .css({top: item.pageY - 10, left: item.pageX + 10})
            .fadeIn(200);
    } else {
        tooltip.hide();
    }
});

redButton.click(function() {
    try {
        currentPointClass = POINT_CLASS.RED;
        redButton.addClass(RED_CLASS);
        blueButton.removeClass(BLUE_CLASS);
    } catch(e) {
        alert(e);
    }
});

blueButton.click(function () {
    try {
        currentPointClass = POINT_CLASS.BLUE;
        redButton.removeClass(RED_CLASS);
        blueButton.addClass(BLUE_CLASS);
    } catch(e) {
        alert(e);
    }
});

resetButton.click(function () {
    graph.reset();
    graph.update();
});

var updateTable = function(activeElementId) {
    tableContainer.html("");
    for (var i = 0; i < table.points.length; i++) {
        tableContainer.append(table.points[i].toHtml(activeElementId == i));
    }
}

goToTrainingButton.click(function () {
    graphManager.reset();
    table.reset();
    table.addPoint(new TableEntry(0, 
        undefined,
        undefined,
        undefined,
        graphManager.neuron.weights,
        undefined,
        undefined));

    for (var i = 0; i < graph.consecutiveInput.length; i++) {
        table.addPoint(new TableEntry(i+1,
            graph.consecutiveInput[i].input,
            graph.consecutiveInput[i].class,
            undefined,
            undefined,
            undefined,
            undefined));
    }
    trainingScreen.addClass(INVISIBLE_CLASS);
    visualScreen.removeClass(INVISIBLE_CLASS);
    graphManager.update();
    updateTable(0);
});


$(document).on("click", ".list-group-item", function () {
    var stepNumber = parseInt($(this).find("span").text());
    graphManager.reset();    
    for (var i = 1; i <= stepNumber; i++) {
        var entry = table.points[i];
        if (entry.stepSize) {
            graphManager.neuron.step = entry.stepSize;
        } else {
            graphManager.neuron.step = stepSlider.val();
        }
        graphManager.setClass(entry.expectedClassName);
        var actualClass = graphManager.neuron.classify(entry.input);
        var weights = graphManager.neuron.weights.slice();
        graphManager.train(entry.input[0], entry.input[1]);
        table.points[i] = new TableEntry(i,
            entry.input,
            entry.expectedClassName,
            actualClass,
            weights,
            graphManager.neuron.step,
            graphManager.neuron.weights.slice());
    }
    for (var i = stepNumber + 1; i < table.points.length; i++) {
        table.points[i].actualClassName = undefined;
        table.points[i].weights = undefined;
        table.points[i].stepSize = undefined;
        table.points[i].correcedWeights = undefined;
    }
    updateTable(stepNumber);
    graphManager.update();

    tableContainer.scrollTop(0);
    var activeElement = $("." + ACTIVE_CLASS).first();
    tableContainer.scrollTop(activeElement.offset().top - tableContainer.offset().top - (tableContainer.height() - activeElement.height())/2.0);
});

stepSlider.on("input change", function () {
    try {
        var val = $(this).val();
        graphManager.neuron.step = val;
        stepBadge.text(val);
    } catch(e) {
        alert(e);
    }
})

again.click(function () {
    location.reload();
});