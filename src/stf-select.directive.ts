import { IOptionScope } from './../dist/stf-select-option.directive.d';
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
    optionsClass: string;
}

export class StfSelectDirective {
    _getScope: () => IScopeStfSelect = () => null;
    template: string = `
<section class="stf-select" ng-class="{'stf-select_has-value': ngModel? true : false, 'stf-select_focused': focused, 'stf-select_disabled': disabled || ngDisabled}">
    <div class="stf-select__label" ng-transclude="label"></div>
    <section class="stf-select__container" tabindex="0"> 
        <section class="stf-select__inner-wrapper">
            <div class="stf-select__value" ng-transclude="value"></div>
            <div class="stf-select__placeholder"  ng-transclude="label"></div>
            <div class="stf-select__icon"></div>
        </section>

        <section class="stf-select__search-input"  ng-transclude="searchInput"></section>
        <section class="stf-select__options">
        <div class="stf-select__fixed-option sss"></div>    
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
        optionsClass: "<"
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
        let openScrollTimerId;
        let jqSelectOptions = element.find('.stf-select__options');
        let placeHolder = element.find('.stf-select__placeholder');

        let self = this;
        let elementChildren = element.children('.stf-select');
        let valueClicked = false;

        ngModelController.$render = () => scope.ngModel = ngModelController.$viewValue;

        scope.selectId = Math.round(Math.random() * 100000000000);
        element.attr('data-stf-select-id', scope.selectId);
        const $body = $('body');
        const $searchInputContainer = element.find('.stf-select__search-input');

        const elemetClickSubscription = Observable.fromEvent($searchInputContainer, 'click')
            .subscribe((event: any) => {
                event.stopPropagation();
            });

        $searchInputContainer.delegate("input", "keydown", function(event){
            
        });

        const $searchInputContainerKeyDownSubscription = Observable.fromEvent($searchInputContainer, 'keydown')
            .subscribe(
            (event: any) => {
                var keyCode = event.keyCode || event.which;
                if (scope.focused) {
                    switch (keyCode) {
                        case 9: hideDropDown();
                            break;
                        case 40: selectKeyDownPressed();
                            break;
                        case 38: selectKeyUpPressed();
                            break;
                        case 27: hideDropDown(); 
                            break;
                    }
                }
            }
            );



        const $searchInputFocusSubscription = Observable.fromEvent($searchInputContainer, 'focus')
            .subscribe((event: any) => {
                elementChildren.addClass('stf-select__tab-focus');
            });

        const $searchInputBlurSubscription = Observable.fromEvent($searchInputContainer, 'blur')
            .subscribe((event: any) => {
                elementChildren.removeClass('stf-select__tab-focus');
            });


        const $searchInputKePressSubscription = Observable.fromEvent($searchInputContainer, 'click')
            .subscribe((event: any) => {
                showDropDown();
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

        let scrollListener = _.debounce(() => {
            calculatePositionAnsSize();
        }, 100);
        document.addEventListener('scroll', scrollListener, true);


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

                setTimeout(() => $searchInputContainer.focus(), 100);
            }
        );


        scope.$watch('focused', (newValue: boolean, oldValue) => {

            if (scope.focused) {
                if (element.find('.stf-select__search-input input').length) {
                    setTimeout(() => scope.focused && element.find('.stf-select__search-input input').first().focus(), 200);
                } else if ($searchInputContainer.length) {
                    setTimeout(() => scope.focused && $searchInputContainer.first().focus(), 200);
                }

                scrollUnscrollContainers();
                calculatePositionAnsSize();
            } else {
                scrollUnscrollContainers();
            }
        });

        let options;
        let fixedOpt;
        let jOptins;
        let jOptinsParent;
        let transcludedScope: angular.IScope;



        transcludeFn((transcludeEls, scopeTr: angular.IScope) => {
            _.each(transcludeEls, el => {
                if (el.tagName === "STF-SELECT-OPTIONS") {
                    options = el;
                }

                if (el.tagName === "STF-FIXED-OPTION") {
                    fixedOpt = el;
                }
            });

            transcludedScope = scopeTr;


            $('body').append(this.$compile(`
                <div ng-attr-class="{{optionsClass}}">
                    <div ng-class="{'stf-select_has-value': ngModel? true : false, 
                                'stf-select_focused': focused, 'stf-select_disabled': disabled || ngDisabled}">
                            <div class="stf-select__options"  id="stf-select-optins-${scope.selectId}"></div>
                    </div>
                </div>
            `)(scope));

            jOptins = $(`#stf-select-optins-${scope.selectId}`);
            jOptins.append(options);
            jOptins.append('<div tabindex="0" class="stf-select__fixed-option"></div>');
            jOptins.children('.stf-select__fixed-option').append(fixedOpt);
            jOptinsParent = jOptins.parent();

            jOptins.delegate('.stf-select-option', "keydown", (function (event) {
                var keyCode = event.keyCode || event.which;

                switch (keyCode) {
                    case 13:
                        setTimeout(() => this.click(), 100);
                        break;
                    case 9:
                        hideDropDown();
                        break;
                    case 40: {
                            optionKeyDown($(event.target));
                            event.preventDefault();
                        }
                        break;
                    case 38: {
                            optionKeyUp($(event.target));
                            event.preventDefault();
                        }
                        break;
                }
            }));

            jOptins.find('.stf-select__fixed-option').keydown(function (event) {
                var keyCode = event.keyCode || event.which;
                switch (keyCode) {
                    case 13: {
                        jOptins.find('stf-fixed-option').click();
                        hideDropDown();
                    }
                        break;
                    case 38:
                        fixedKeyUpPressed();
                        break;
                    case 40:
                        fixedKeyDownPressed();
                        break;
                    case 9:
                        hideDropDown();
                        break;
                }
            });
        });


        scope.$on('$destroy', () => {
            valueContainerSubscription.unsubscribe();
            windowClickSubscription.unsubscribe();
            windowResizeSubscription.unsubscribe();
            jOptinsParent.parent().remove();
            elementMouseWheelSubscription.unsubscribe();
            elemetClickSubscription.unsubscribe();
            iconElSubscription.unsubscribe();

            document.removeEventListener('scroll', scrollListener, true);
            $('body, .modal-content').css('overflow-y', '');
            clearTimeout(openScrollTimerId);
            $searchInputFocusSubscription.unsubscribe();
            $searchInputKePressSubscription.unsubscribe();
            transcludedScope.$destroy();
        });



        //calculatePositionAnsSize();

        function calculatePositionAnsSize() {
            if (!scope.focused) {
                return;
            }

            let elOffset = element.children().offset();

            jOptinsParent.width(elementChildren.width());
            jOptins.width(elementChildren.width());
            if (
                (jqSelectOptions.offset().top
                    + jOptins.height() + 10
                )
                > (window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight)
            ) {
                jOptinsParent.addClass('top');
                jOptins.css('top', elOffset.top - jOptins.height() - 28);
            } else {
                jOptinsParent.removeClass('top');
                jOptins.css('top', jqSelectOptions.offset().top);
            }

            jOptins.css('left', elOffset.left);
        }


        function mdFixes() {
        }

        function scrollUnscrollContainers() {
            if (scope.focused) {
                let jqContainer = $('body, .modal-content');
                jqContainer.css('overflow-y', 'hidden');
                openScrollTimerId = setTimeout(() => jqContainer.css('overflow-y', 'hidden'), 200);
            } else {
                $('body, .modal-content').css('overflow-y', '');
            }
        } element

        function showDropDown() {
            if (!scope.disabled && !scope.ngDisabled) {
                valueClicked = true;
                scope.focused = true;
                scope.$apply();
            }
        }

        function hideDropDown() {
            scope.focused = false;
            $searchInputContainer.focus();
            setTimeout(() => {
                scope.focused || scope.$applyAsync();
            }, 0);
        }

        function selectKeyDownPressed() {
            setTimeout(() => jOptins.find('.stf-select-option').first().focus(), 100);
        }

        function selectKeyUpPressed() {
            let elementForFocus = jOptins.find('.stf-select__fixed-option').last();

            if (!elementForFocus.length) {
                elementForFocus = jOptins.find('.stf-select-option').last();
            }

            setTimeout(() => elementForFocus.focus(), 100);
        }

        function fixedKeyUpPressed() {
            let elementForFocus = jOptins.find('.stf-select-option').last();

            if (!elementForFocus.length) {
                elementForFocus = $searchInputContainer.find('input').length ? $searchInputContainer.find('input') : $searchInputContainer;
            }

            setTimeout(() => elementForFocus.focus(), 100);
        }

        function fixedKeyDownPressed() {
            let elementForFocus = $searchInputContainer.find('input').length ? $searchInputContainer.find('input') : jOptins.find('.stf-select-option').first();

            setTimeout(() => elementForFocus.focus(), 100);
        }

        function optionKeyDown(element) {
            let elementForFocus = element.parent().next().children();
            
            if(!elementForFocus.length){
                elementForFocus = jOptins.find('.stf-select__fixed-option');
            }
            
            if(!elementForFocus.length){
                elementForFocus = $searchInputContainer.find('input');
            }

            if(!elementForFocus.length){
                elementForFocus = jOptins.find('.stf-select-option').first();
            }

            elementForFocus.focus();
        }

        function optionKeyUp(element) {
            let elementForFocus = element.parent().prev().children();

            if(!elementForFocus.length){
                elementForFocus = $searchInputContainer.find('input');
            }

            
            if(!elementForFocus.length){
                elementForFocus = jOptins.find('.stf-select__fixed-option');
            }
            
        
            if(!elementForFocus.length){
                elementForFocus = jOptins.find('.stf-select-option').last();
            }

            elementForFocus.focus();
        }
    }

    public static Factory($translate: angular.translate.ITranslateService, $window: angular.IWindowService, $compile: angular.ICompileService, NP_STF_SELECT_THROTTLE_TIME: number) {
        return new StfSelectDirective($translate, $window, $compile, NP_STF_SELECT_THROTTLE_TIME);
    }
}

StfSelectDirective.Factory.$inject = ['$translate', "$window", "$compile", "NP_STF_SELECT_THROTTLE_TIME"];