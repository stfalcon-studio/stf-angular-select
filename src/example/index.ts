import { ExampleAppComponent } from './example-app.component';
import "../stf-select.scss";
import "./example.scss";
import { StfSelectDirective, StfSelectOptionDirective } from "../index";
import * as angular from "angular";

angular.module("app", ["pascalprecht.translate",])
    .constant('NP_STF_SELECT_THROTTLE_TIME', 100) // throtle  time of reaction after clicking
    .component('exampleApp', new ExampleAppComponent())
    .directive('npStfSelect', StfSelectDirective.Factory)
    .directive('stfSelectOption', StfSelectOptionDirective.Factory)
    ;


angular.bootstrap(document, ["app"], {
    strictDi: true
});  