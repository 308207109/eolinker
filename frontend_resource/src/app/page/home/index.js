(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('home', {
                    url: '/home',// url相对路径/home
                    template: '<home></home>'
                });
        }])
})();