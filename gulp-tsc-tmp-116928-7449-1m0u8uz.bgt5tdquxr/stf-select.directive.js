"use strict";
/**
 * Created by andrey on 06.09.16.
 */
const Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/map');
require('rxjs/add/operator/throttleTime');
require('rxjs/add/observable/fromEvent');
const _ = require("lodash");
class StfSelectDirective {
    constructor($translate, $window, _NP_STF_SELECT_THROTTLE_TIME) {
        this.$translate = $translate;
        this.$window = $window;
        this._NP_STF_SELECT_THROTTLE_TIME = _NP_STF_SELECT_THROTTLE_TIME;
        this._getScope = () => null;
        this.template = require("./stf-select.html");
        this.restrict = 'E';
        this.require = "ngModel";
        this.scope = {
            fixNgModal: "<",
            ngDisabled: "<",
            disabled: "<",
        };
        this.transclude = {
            label: 'stfSelectLabel',
            value: 'stfSelectValue',
            options: 'stfSelectOptions',
            searchInput: '?stfSearchInput',
        };
    }
    link(scope, element, attributes, ngModelController) {
        if (scope.fixNgModal)
            mdFixes();
        let valueClicked = false;
        ngModelController.$render = () => scope.ngModel = ngModelController.$viewValue;
        scope.selectId = Math.round(Math.random() * 100000000000);
        element.attr('data-stf-select-id', scope.selectId);
        const $body = $('body');
        const elemetClickSubscription = Observable_1.Observable.fromEvent(element.find('.stf-select__search-input'), 'click')
            .subscribe((event) => {
            event.stopPropagation();
        });
        const valueContainer = element.find('.stf-select__inner-wrapper');
        const valueContainerObservable = Observable_1.Observable.fromEvent(valueContainer, 'click').throttleTime(this._NP_STF_SELECT_THROTTLE_TIME);
        const valueContainerSubscription = valueContainerObservable.subscribe(event => {
            console.log('value click');
            if (!scope.disabled && !scope.ngDisabled) {
                valueClicked = true;
                scope.focused = true;
                scope.$apply();
            }
        });
        let ll = 333;
        const iconEl = element.find('.stf-select__icon');
        const iconElObservable = Observable_1.Observable.fromEvent(iconEl, 'click').throttleTime(this._NP_STF_SELECT_THROTTLE_TIME);
        const iconElSubscription = iconElObservable.subscribe(event => {
            console.log(ll, scope.focused);
            if (scope.focused) {
                event.stopPropagation();
                scope.focused = false;
                scope.$apply();
            }
            console.log(666, scope.focused);
            ll++;
        });
        const windowClickObservable = Observable_1.Observable.fromEvent(this.$window, 'click').throttleTime(100);
        const windowClickSubscription = windowClickObservable.subscribe(() => {
            if (!valueClicked && scope.focused) {
                scope.focused = false;
                scope.$applyAsync();
            }
            else {
                valueClicked = false;
            }
        });
        const jqFilterInput = element.find('.stf-select__search-input input');
        const elementMouseWheelObservable = Observable_1.Observable.fromEvent(element, "mousewheel");
        const elementMouseWheelSubscription = elementMouseWheelObservable.subscribe((event) => {
            if (scope.focused) {
                event.stopPropagation();
                event.returnValue = false;
            }
        });
        const stfSelectOption = element.find('.stf-select-option');
        scope.$on('stf-select-option.selected', (event, value) => {
            let old = ngModelController.$viewValue;
            scope.focused = false;
            if (old !== value) {
                ngModelController.$setViewValue(value);
                scope.ngModel = value;
            }
        });
        scope.$watch('focused', (newValue, oldValue) => {
            if (scope.focused) {
                if (jqFilterInput.length) {
                    setTimeout(() => jqFilterInput.focus(), 200);
                }
            }
        });
        scope.$on('$destroy', () => {
            valueContainerSubscription.unsubscribe();
            windowClickSubscription.unsubscribe();
            elementMouseWheelSubscription.unsubscribe();
            elemetClickSubscription.unsubscribe();
            iconElSubscription.unsubscribe();
        });
        function mdFixes() {
            const $modalContent = element.closest('.modal-content');
            const $modalContentZIndex = $modalContent.css("z-index") || 0;
            scope.$watch('focused', (newValue, oldValue) => {
                if (scope.focused) {
                    $modalContent.css('overflow', 'visible');
                    $modalContent.css('z-index', 1);
                }
                else {
                    $modalContent.css('overflow', 'hidden');
                    $modalContent.css('z-index', $modalContentZIndex);
                }
            });
            scope.$on('$destroy', () => {
                $modalContent.css('z-index', $modalContentZIndex);
            });
        }
    }
    static Factory($translate, $window, NP_STF_SELECT_THROTTLE_TIME) {
        return new StfSelectDirective($translate, $window, NP_STF_SELECT_THROTTLE_TIME);
    }
}
exports.StfSelectDirective = StfSelectDirective;
//StfSelectDirective.Factory.$inject = ['$translate', "$window", "NP_STF_SELECT_THROTTLE_TIME"]; 
