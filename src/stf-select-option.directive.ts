import * as angular from 'angular';
import IScope = angular.IScope;
/**
 * Created by andrey on 06.09.16.
 */

export interface IOptionScope extends IScope{
    selectValue: Function;
    ngValue: any;
    value: any;
    modelVaule: any;   
}

export class StfSelectOptionDirective
{
    transclude: any =  true;
    restrict: any = 'E';
    template: string = `
    <section ng-class="{'stf-select-option__selected': modelVaule===ngValue}" tabindex="0" class="stf-select-option" data-ng-click="selectValue()" ng-transclude></section>
    `;
    scope: any = {
        ngValue: "<?",
        value: "@?"
    };

    link(scope: IOptionScope, element, attrs){ 
        scope.selectValue = function(){
            scope.$emit("stf-select-option.selected", scope.ngValue || scope.value);
        }

        scope.$on('stf-select.value_changed', (event, model) =>{
            scope.modelVaule = model;
        });
    }

    public static Factory() {
        return new StfSelectOptionDirective();
    }
}