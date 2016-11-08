import "../stf-select.scss";
import { StfSelectDirective, StfSelectOptionDirective } from "../index";

angular.module("app", [])
    .constant('NP_STF_SELECT_THROTTLE_TIME', 100) // throtle  time of reaction after clicking
    .directive('npStfSelect', StfSelectDirective.Factory)
    .directive('stfSelectOption', StfSelectOptionDirective.Factory)
    ;


angular.bootstrap(document, ["app"], {
    strictDi: true
});  