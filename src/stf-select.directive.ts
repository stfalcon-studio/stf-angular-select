import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';

const _: _.LoDashStatic = require("lodash");


export interface IScopeStfSelect extends angular.IScope {
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
    template: string = `
<section class="stf-select" ng-class="{'stf-select_has-value': ngModel? true : false, 'stf-select_focused': focused, 'stf-select_disabled': disabled || ngDisabled}">
    <div class="stf-select__label" ng-transclude="label"></div>
    <section class="stf-select__container"> 
        <section class="stf-select__inner-wrapper">
            <div class="stf-select__value" ng-transclude="value"></div>
            <div class="stf-select__placeholder" ng-transclude="label"></div>
            <div class="stf-select__icon"></div>
        </section>

        <section class="stf-select__search-input" ng-transclude="searchInput"></section>
        <section class="stf-select__options">
        <div class="stf-select__fixed-option"></div>
        </section>
    </section>
</section>
    `;
    //ng-transclude="options"
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
        //options: 'stfSelectOptions',
        searchInput: '?stfSearchInput',
        //fixedOption: '?stfFixedOption'
    };


    constructor(protected $translate: angular.translate.ITranslateService, protected $window: angular.IWindowService, protected $compile: angular.ICompileService, protected _NP_STF_SELECT_THROTTLE_TIME: number) {

    }


    link(scope: IScopeStfSelect, element, attributes: any, ngModelController: angular.INgModelController, transcludeFn: angular.ITranscludeFunction) {
        if (scope.fixNgModal)
            mdFixes();

        let self = this;
        let elementChildren = element.children('.stf-select');
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
            if (!scope.disabled && !scope.ngDisabled) {
                valueClicked = true;
                scope.focused = true;
                scope.$apply();
            }

        });

        const iconEl = element.find('.stf-select__icon');
        const iconElObservable: Observable<any> = Observable.fromEvent(iconEl, 'click').throttleTime(this._NP_STF_SELECT_THROTTLE_TIME);
        const iconElSubscription = iconElObservable.subscribe(event => {
            if (scope.focused) {
                event.stopPropagation();
                scope.focused = false;
                scope.$apply();
            }
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

        const windowResizeObservable: Observable<any> = Observable.fromEvent(this.$window, 'resize').throttleTime(100);
        const windowResizeSubscription = windowResizeObservable.subscribe(
            event => calculatePositionAnsSize()
        );



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
                if (old !== value) {
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

                if(newValue !== oldValue){
                    calculatePositionAnsSize();
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

        const transcludeEls = transcludeFn();

        let options;
        let fixedOpt;
        _.each(transcludeEls, el => {
            if (el.tagName === "STF-SELECT-OPTIONS") {
                options = el;
            }

            if (el.tagName === "STF-FIXED-OPTION") {
                fixedOpt = el;
            }
        });

        $('body').append(this.$compile(`<div 
        ng-class="{'stf-select_has-value': ngModel? true : false, 'stf-select_focused': focused, 'stf-select_disabled': disabled || ngDisabled}">
                <div class="stf-select__options"  id="stf-select-optins-${scope.selectId}"></div>
            </div>`)(scope));
        let jOptins = $(`#stf-select-optins-${scope.selectId}`);
        jOptins.append(options);
        jOptins.append('<div class="stf-select__fixed-option"></div>');
        jOptins.children('.stf-select__fixed-option').append(fixedOpt);

        calculatePositionAnsSize();
        setTimeout(()=>calculatePositionAnsSize(), 200);
        setTimeout(()=>calculatePositionAnsSize(), 500);
        setTimeout(()=>calculatePositionAnsSize(), 1000); 
         

        function calculatePositionAnsSize()
        {
            let elOffset = element.offset();
            jOptins.width(elementChildren.width()); 
            if((elOffset.top + 420 + elementChildren.height()) > self.$window.outerHeight){
                jOptins.css('top', elOffset.top - elementChildren.height() - 180);
            } else {
                jOptins.css('top', elOffset.top + elementChildren.height() - 17);
            }

            jOptins.css('left', elOffset.left);
        }


        function mdFixes() {
            /*const $modalContent = element.closest('.modal-content');
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
            });*/


        }
    }

    public static Factory($translate: angular.translate.ITranslateService, $window: angular.IWindowService, $compile: angular.ICompileService, NP_STF_SELECT_THROTTLE_TIME: number) {
        return new StfSelectDirective($translate, $window, $compile, NP_STF_SELECT_THROTTLE_TIME);
    }
}

StfSelectDirective.Factory.$inject = ['$translate', "$window", "$compile", "NP_STF_SELECT_THROTTLE_TIME"];