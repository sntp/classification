var TableEntry = function(stepNumber, 
                          input,
                          expectedClassName,
                          actualClassName,
                          weights,
                          stepSize,
                          correcedWeights) {
    this.stepNumber = stepNumber;
    this.input = input,
    this.expectedClassName = expectedClassName;
    this.actualClassName = actualClassName;
    this.weights = weights;
    this.stepSize = stepSize;
    this.correcedWeights = correcedWeights;

    this.toHtml = function(active) {
        var a = $("<a/>").addClass("list-group-item");
        if (active) {
            a.addClass("active");
        }
        var stepNumber = $("<span/>").text(this.stepNumber);
        var header = $("<h4/>").addClass("list-group-item-heading")
                               .text("Step ")
                               .append(stepNumber);
        a.append(header);

        var body = $("<p/>").addClass("list-group-item-text");
        var bodyText = "";

        if (this.weights != undefined && this.weights.length > 0) {
            var ul = $("<ul/>").addClass("list-unstyled");
            for (var i = 0; i < this.weights.length; i++) {
                ul.append($("<li/>").text("W" + (i + 1) + " = " + this.weights[i]));
            }
            bodyText += "Weights:<br/>"
            bodyText += ul.wrap("<fix/>").parent().html();
        }

        if (this.stepSize != undefined) {
            bodyText += "Step size: " + this.stepSize + "<br/>";
        }

        if (this.input != undefined && this.input.length > 0) {
            bodyText += "Input values: ";
            for (var i = 0; i < this.input.length; i++) {
                bodyText += this.input[i];
                if (i != this.input.length-1) {
                    bodyText += ", ";
                } else {
                    bodyText += "<br/>";
                }
            }
        }

        if (this.expectedClassName != undefined) {
            bodyText += "Expected class: " + CLASS_NAME[this.expectedClassName] + "<br/>";
        }

        if (this.actualClassName != undefined) {
            bodyText += "Actual class: " + CLASS_NAME[this.actualClassName] + "<br/>";
        }

        if (this.expectedClassName != undefined
                && this.actualClassName != undefined
                && this.actualClassName == this.expectedClassName) {
            bodyText += "Correction isn't needed";
        } else if (this.weights != undefined
                && this.correcedWeights != undefined
                && this.input != undefined
                && this.weights.length == this.input.length 
                && this.input.length == this.correcedWeights.length) {
            var ul = $("<ul/>").addClass("list-unstyled");
            for (var i = 0; i < this.input.length; i++) {
                var correction = "(" + this.expectedClassName + (this.actualClassName > 0? "-" : "+") 
                    + Math.abs(this.actualClassName) + ")";
                var input = this.input[i] > 0? this.input[i] : "(" + this.input[i] + ")";

                var s = "W" + (i + 1) + " = " + this.weights[i] + " + " + this.stepSize + " * " 
                    + correction + " * " + input + " = " + this.correcedWeights[i];
                ul.append($("<li/>").text(s));
            }
            bodyText += "Correction:";
            bodyText += ul.wrap("<fix/>").parent().html();
        }

        body.html(bodyText);
        a.append(body);
        return a;
    }
}

var Table = function() {
    this.points = [];

    this.addPoint = function(tableEntry) {
        this.points.push(tableEntry);
    }

    this.reset = function() {
        this.points = [];
    }
    
    this.uniquElementsCount = function() {
        var uniquElements = 0;
        for (var k = 1; k < this.points.length; k++) {
            var alreadyInList = false;
            for (var i = 1; i < this.points.length; i++) {
                if (k == i) {
                    continue;
                }
                var equal = true;
                for (var j = 1; j < this.points[k].input.length; j++) {
                    if (this.points[i].input[j] != this.points[k].input[j]) {
                        equal = false;
                        break;
                    }
                }
                equal &= (this.points[i].expectedClassName == this.points[k].expectedClassName);
                if (equal) {
                    alreyInList = true;
                    break;
                }
            }
            
            if (!alreadyInList) {
                uniquElements++;
            }
        }
        return uniquElements;
    }
}
