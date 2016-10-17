const BLUE_CLASS = "btn-info",
      RED_CLASS = "btn-danger",
      DEFAULT_CLASS = "btn-default",
      ACTIVE_CLASS = "active",
      DISABLED_ATTR = "disabled",
      CHECKED_ATTR = "checked";

var plot = $("#plot"),
    tooltip = $("#tooltip"),
    redButton = $("#red-class"),
    blueButton = $("#blue-class"),
    trainButton = $("#train-button"),
    classifyButton = $("#classify-button"),
    resetButton = $("#reset"),
    stepSlider = $("#step"),
    stepBadge = $("#step-size"),
    showLine = $("#show-line"),
    w1 = $("#w1"),
    w2 = $("#w2"),
    w3 = $("#w3"),
    editW1Button = $("#edit-w1"),
    editW2Button = $("#edit-w2"),
    editW3Button = $("#edit-w3");

var graphManager = new GraphManager("#plot");

var updateWeights = function() {
    w1.val(graphManager.neuron.weights[0]);
    w2.val(graphManager.neuron.weights[1]);
    w3.val(graphManager.neuron.weights[2]);
}

var update = function() {
    try {
        graphManager.update();
        updateWeights();
    } catch(e) {
        alert(e);
    }
}

var init = function() {
    try {
        var mode = graphManager.mode;
        if (mode == MODE.TRAIN) {
            trainButton.click();
        } else if (mode == MODE.CLASSIFY) {
            classifyButton.click();
        } else {
            throw new Error("INITIALIZATION ERROR: Unknown mode '" + mode + "'");
        }

        var currentClass = graphManager.currentClass;
        if (currentClass == POINT_CLASS.RED) {
            redButton.addClass(RED_CLASS);
        } else if (currentClass == POINT_CLASS.BLUE) {
            blueButton.addClass(BLUE_CLASS);
        } else {
            throw new Error("INITIALIZATION ERROR: Unknown class '" + currentClass + "'");
        }

        update();
        stepSlider.val(graphManager.neuron.step);
        stepSlider.change();

        if (graphManager.getShowLine()) {
            showLine.attr(CHECKED_ATTR, CHECKED_ATTR);
        } else {
            showLine.removeAttr(CHECKED_ATTR);
        }
    } catch(e) {
        alert(e);
    }
}

$(document).ready(init);

plot.bind("plotclick", function (event, pos, item) {
    try {
        graphManager.input(pos.x, pos.y);
        update();
    } catch(e) {
        alert(e);
    }
});

plot.bind("plothover", function (event, pos, item) {
    if (item) {
        var x = item.datapoint[0].toFixed(3),
            y = item.datapoint[1].toFixed(3);

        tooltip.html("X: " + x + ", Y: " + y)
            .css({top: item.pageY, left: item.pageX})
            .fadeIn(200);
    } else {
        tooltip.hide();
    }
});

trainButton.click(function () {
    graphManager.setMode(MODE.TRAIN);
    trainButton.addClass(ACTIVE_CLASS);
    classifyButton.removeClass(ACTIVE_CLASS);
    redButton.removeAttr(DISABLED_ATTR);
    blueButton.removeAttr(DISABLED_ATTR);
});

classifyButton.click(function () {
    graphManager.setMode(MODE.CLASSIFY);
    trainButton.removeClass(ACTIVE_CLASS);
    classifyButton.addClass(ACTIVE_CLASS);
    redButton.attr(DISABLED_ATTR, DISABLED_ATTR);
    blueButton.attr(DISABLED_ATTR, DISABLED_ATTR);
});

redButton.click(function() {
    try {
        graphManager.setClass(POINT_CLASS.RED);
        redButton.addClass(RED_CLASS);
        blueButton.removeClass(BLUE_CLASS);
    } catch(e) {
        alert(e);
    }
});

blueButton.click(function () {
    try {
        graphManager.setClass(POINT_CLASS.BLUE);
        redButton.removeClass(RED_CLASS);
        blueButton.addClass(BLUE_CLASS);
    } catch(e) {
        alert(e);
    }
});

resetButton.click(function () {
    try {
        graphManager.reset();
        init();
    } catch(e) {
        alert(e);
    }
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

showLine.change (function () {
    if ($(this).attr(CHECKED_ATTR)) {
        graphManager.setShowLine(true);
    } else {
        graphManager.setShowLine(false);
    }
});

var parseFloatOrThrowError = function(n) {
    if (/^[-+]?(\d+|\d*\.\d+)$/.test(n)) {
        return parseFloat(n);
    }
    throw new Error("Parsing Error: " + n + " is not a float.");
}

editW1Button.click(function () {
    try {
        graphManager.neuron.weights[0] = parseFloatOrThrowError(w1.val());
    } catch(e) {
        alert(e);
    }
    update();
});

editW2Button.click(function () {
    try {
        graphManager.neuron.weights[1] = parseFloatOrThrowError(w2.val());
    } catch(e) {
        alert(e);
    }
    update();
});

editW3Button.click(function () {
    try {
        graphManager.neuron.weights[2] = parseFloatOrThrowError(w3.val());
    } catch(e) {
        alert(e);
    }
    update();
});
