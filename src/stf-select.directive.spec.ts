/**
 * Created by andrey on 22.09.16.
 */
import * as angular from 'angular';
require('phantomjs-polyfill');
require('es6-promise').polyfill();
import "angular";
import "angular-mocks";
import {StfSelectDirective} from "./stf-select.directive";
import {StfSelectOptionDirective} from "./stf-select-option.directive";
import "angular-translate";

interface IItemStfSelect{
    name: string;
}

interface ITestInterfaceStfSelectEnvironmentScope extends angular.IScope
{
    items: IItemStfSelect[];
    val: IItemStfSelect;
}

describe('directive: stf-select', function () {
    let $compile: ng.ICompileService,
        scope: ITestInterfaceStfSelectEnvironmentScope,
        directiveUsage: string = `
<stf-select name="address" ng-required="true" ng-model="val">
    <stf-select-label>My select</stf-select-label>
    <stf-select-value>{{val.name}}</stf-select-value>
    <stf-select-options>
        <stf-select-option data-ng-repeat="item in items track by $index"ng-value="item">{{item.name}}</stf-select-option>
    </stf-select-options>
    <stf-search-input>
        <input id="input">
    </stf-search-input>
</stf-select>
`;

    angular
        .module('testapp_stf_select', ["pascalprecht.translate"])
        .constant('NP_STF_SELECT_THROTTLE_TIME', 0)
        .directive('stfSelect', StfSelectDirective.Factory)
        .directive('stfSelectOption', StfSelectOptionDirective.Factory)
    ;

    beforeEach(angular.mock.module('testapp_stf_select'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should render init data right", function () {
        scope.items = [
            {name: 'name1'},
            {name: 'name2'},
            {name: 'name3'},
            {name: 'name4'}
        ];

        scope.val = {name: 'name4'};

        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element[0].querySelector('stf-select-value').innerHTML).toContain('name4');
        expect(element[0].querySelector('.stf-select__placeholder stf-select-label').innerHTML).toContain('My select');
        expect(element[0].querySelector('.stf-select__label stf-select-label').innerHTML).toContain('My select');
        expect(element[0].querySelectorAll(`#stf-select-optins-${element.attr('data-stf-select-id')} stf-select-option`).length).toEqual(scope.items.length);
    });

    it("should changing functional work right", function () {

        scope.items = [
            {name: 'name1'},
            {name: 'name2'},
            {name: 'name3'},
            {name: 'name4'}
        ];

        scope.val = null;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_focused')).toBeFalsy();
        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_has-value')).toBeFalsy();


        element.find('.stf-select__inner-wrapper').trigger('click');
        scope.$digest();

        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_focused')).toBeTruthy();
        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_has-value')).toBeFalsy();

        element.find(`#stf-select-optins-${element.attr('data-stf-select-id')} stf-select-option .stf-select-option`).last().trigger('click');
        scope.$digest();
        scope.$digest();
        expect(element[0].querySelector('stf-select-value').innerHTML).toContain('name4');
        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_focused')).toBeFalsy();
        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_has-value')).toBeTruthy();
    });

    it("should click icon work fine", function () {
        scope.items = [
            {name: 'name1'},
            {name: 'name2'},
            {name: 'name3'},
            {name: 'name4'}
        ];

        scope.val = null;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_focused')).toBeFalsy();
        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_has-value')).toBeFalsy();

        const iconEl = element.find('.stf-select__icon');
        iconEl.trigger('click');
        scope.$digest();

        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_focused')).toBeTruthy();
        
        console.log('click two');
        iconEl.trigger('click');
        scope.$digest();

        expect(element[0].querySelector('.stf-select').classList.contains('stf-select_focused')).toBeFalsy();
    });
});