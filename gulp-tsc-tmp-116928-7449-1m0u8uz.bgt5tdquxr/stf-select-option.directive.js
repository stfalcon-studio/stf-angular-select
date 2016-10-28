"use strict";
class StfSelectOptionDirective {
    constructor() {
        this.transclude = true;
        this.restrict = 'E';
        this.template = require("./stf-select-option.html");
        this.scope = {
            ngValue: "<?",
            value: "@?"
        };
    }
    link(scope, element, attrs) {
        scope.selectValue = function () {
            scope.$emit("stf-select-option.selected", scope.ngValue || scope.value);
        };
    }
    static Factory() {
        return new StfSelectOptionDirective();
    }
}
exports.StfSelectOptionDirective = StfSelectOptionDirective;
