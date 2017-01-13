import * as angular from "angular";

export class ExampleAppComponent implements angular.IComponentOptions
{
    controller = ExampleAppController;
    template = require('./example.html')
}

export class ExampleAppController
{
    static $inject = ['$timeout'];

    addresses = [
        {id: "1", description: 'Address 1'},
        {id: "2", description: 'Address 2'},
        {id: "3", description: 'Address 3'},
        {id: "4", description: 'Address 4'},
        {id: "5", description: 'Address 5'},
        {id: "6", description: 'Address 6'},
        {id: "7", description: 'Address 7'},
    ]

    address;

    constructor($timeout: angular.ITimeoutService){
        $timeout(()=>this.address = this.addresses[0], 1000);
    }

    clickFiced(){
        console.log('fixed click');
    }
}