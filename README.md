stf-angular-select директива випадаючого списку
==================================================

Директива випадаючого списку з можливістю пошуку і змінення зовнішнього виду і свого html

### Transcludes
- [x]  stfSelectLabel     - Тег в якому розміщуєму бажаний html label
- [x]  stfSelectValue     - Тег в якому розміщуєму бажаний html поточного значення select
- [x]  stfSearchInput     - Тег в якому розміщуєму бажаний html фільтра для списка select
- [x]  stfІelectOptions   - Тег в якому розміщуєму бажаний html опцій списка select
- [x]  stfSelectOption    - Директива опції select, значення передаємо через ng-value

```
<np-stf-select name="senderAddress" ng-model="$ctrl.invoice.senderAddress" required ng-change="$ctrl.updateCalculation();">
    <stf-select-label>{{::('NP_INVOICES_EDIT.SENDER_ADDRESS'| translate)}}</stf-select-label>
    <stf-select-value>{{$ctrl.invoice.senderAddress.description}}</stf-select-value>
    <stf-select-options>
        <stf-select-option data-ng-repeat="address in $ctrl.personalAddressesFiltered track by address.id" ng-value="address">{{address.description}}</stf-select-option>
        <md-divider role="separator"></md-divider>
        <stf-select-option ng-value="null" data-ng-click="$ctrl.addNewAddressSender($ctrl.invoice.sender.id)">
            {{::('NP_INVOICES_EDIT.NEW_ADDRESS'| translate)}}
        </stf-select-option>
    </stf-select-options>
    <stf-search-input>
        <np-input-list-filter placeholder="{{::('NP_INVOICES_EDIT.FIND_ADDRESS'| translate)}}"
                                list-source="$ctrl.personalAddresses"
                                list-filtered="$ctrl.personalAddressesFiltered"
                                filterter-keys="['description']"></np-input-list-filter>
    </stf-search-input>
</np-stf-select>

```

### instalation and using
```
install stf-angular-select --save

```
 
``` javascript
import "stf-angular-select/src/stf-select.scss";
import {StfSelectDirective, StfSelectOptionDirective} from "stf-angular-select";

angular.module("app", [])
    .constant('NP_STF_SELECT_THROTTLE_TIME', 100) // throtle  time of reaction after clicking
    .directive('npStfSelect', StfSelectDirective.Factory)
    .directive('stfSelectOption', StfSelectOptionDirective.Factory);
```