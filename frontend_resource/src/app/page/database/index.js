(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('database', {
                    url: '/database',// url相对路径/database
                    template: '<database></database>'
                });
        }])
})();