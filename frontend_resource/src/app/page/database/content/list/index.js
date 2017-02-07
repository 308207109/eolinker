(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('database.list', {
                    url: '/list?dbID?tableID',// url相对路径/database/list
                    template: '<database-list></database-list>'
                });
        }])
})();