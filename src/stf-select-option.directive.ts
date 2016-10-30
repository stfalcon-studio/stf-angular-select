import IScope = angular.IScope;
/**
 * Created by andrey on 06.09.16.
 */

export interface IOptionScope extends IScope{
    selectValue: Function;
    ngValue: any;
    value: any;
   
}

export class StfSelectOptionDirective
{
    transclude: any =  true;
    restrict: any = 'E';
    template: string = `
    <section class="stf-select-option" data-ng-click="selectValue()" ng-transclude></section>
    `;
    scope: any = {
        ngValue: "<?",
        value: "@?"
    };

    link(scope: IOptionScope, element, attrs){
        scope.selectValue = function(){
            scope.$emit("stf-select-option.selected", scope.ngValue || scope.value);
        }
    }

    public static Factory() {
        return new StfSelectOptionDirective();
    }
}