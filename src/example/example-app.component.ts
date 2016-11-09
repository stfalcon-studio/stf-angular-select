export class ExampleAppComponent implements angular.IComponentOptions
{
    controller = ExampleAppController;
    template = require('./example.html')
}

export class ExampleAppController
{
    addresses = [
        {id: "1", description: 'Address 1'},
        {id: "2", description: 'Address 2'},
        {id: "3", description: 'Address 3'},
    ]
}