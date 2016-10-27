/**
 * Created by andrey on 06.09.16.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

const _: _.LoDashStatic = require("lodash");

interface IScopeStfSelect extends angular.IScope {
    label: string;
    ngModel: any;
    focused: boolean;
    fixNgModal: boolean;
    selectId: number;
    ngDisabled: boolean,
    disabled: boolean,
}

export class StfSelectDirective {
    _getScope: () => IScopeStfSelect = () => null;
    template: string = require("./stf-select.html");
    restrict: string = 'E';
    require = "ngModel";
    scope: any = {
        fixNgModal: "<",
        ngDisabled: "<",
        disabled: "<",
    };
    transclude: any = {
        label: 'stfSelectLabel',
        value: 'stfSelectValue',
        options: 'stfSelectOptions',
        searchInput: '?stfSearchInput',
    };


    constructor(protected $translate: angular.translate.ITranslateService, protected $window: angular.IWindowService, protected _NP_STF_SELECT_THROTTLE_TIME: number) {

    }


    link(scope: IScopeStfSelect, element, attributes: any, ngModelController: angular.INgModelController) {
        if (scope.fixNgModal)
            mdFixes();

        let valueClicked = false;
        
        ngModelController.$render = () => scope.ngModel = ngModelController.$viewValue;

        scope.selectId = Math.round(Math.random() * 100000000000);
        element.attr('data-stf-select-id', scope.selectId);
        const $body = $('body');
        const elemetClickSubscription = Observable.fromEvent(element.find('.stf-select__search-input'), 'click')
            .subscribe((event: any) => {
                event.stopPropagation();
            });


        const valueContainer = element.find('.stf-select__inner-wrapper');
        const valueContainerObservable: Observable<any> = Observable.fromEvent(valueContainer, 'click').throttleTime(this._NP_STF_SELECT_THROTTLE_TIME);
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
        const iconElObservable: Observable<any> = Observable.fromEvent(iconEl, 'click').throttleTime(this._NP_STF_SELECT_THROTTLE_TIME);
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

        const windowClickObservable: Observable<any> = Observable.fromEvent(this.$window, 'click').throttleTime(100);

        const windowClickSubscription = windowClickObservable.subscribe(() => {

            if (!valueClicked && scope.focused) {
                scope.focused = false;
                scope.$applyAsync();
            } else {
                valueClicked = false;
            }
        });

        

        const jqFilterInput = element.find('.stf-select__search-input input');

        const elementMouseWheelObservable = Observable.fromEvent(element, "mousewheel");
        const elementMouseWheelSubscription = elementMouseWheelObservable.subscribe((event: any) => {

            if (scope.focused) {
                event.stopPropagation();
                event.returnValue = false;
            }
        });

        const stfSelectOption = element.find('.stf-select-option');


        scope.$on('stf-select-option.selected',
            (event, value: any) => {
                let old = ngModelController.$viewValue;
                scope.focused = false;
                if(old !== value){
                    ngModelController.$setViewValue(value);
                    scope.ngModel = value;
                }
            }
        );


        scope.$watch('focused', (newValue: boolean, oldValue) => {

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

            scope.$watch('focused', (newValue: boolean, oldValue) => {

                if (scope.focused) {

                    $modalContent.css('overflow', 'visible');
                    $modalContent.css('z-index', 1);
                } else {
                    $modalContent.css('overflow', 'hidden');
                    $modalContent.css('z-index', $modalContentZIndex);
                }

            });

            scope.$on('$destroy', () => {
                $modalContent.css('z-index', $modalContentZIndex);
            });
        }

    }


    public static Factory($translate: angular.translate.ITranslateService, $window: angular.IWindowService, NP_STF_SELECT_THROTTLE_TIME: number) {
        return new StfSelectDirective($translate, $window, NP_STF_SELECT_THROTTLE_TIME);
    }
}

StfSelectDirective.Factory.$inject = ['$translate', "$window", "NP_STF_SELECT_THROTTLE_TIME"];