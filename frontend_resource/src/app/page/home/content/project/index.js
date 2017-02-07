(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('home.project', {
                    url: '/project',// url相对路径/home/project
                    template: '<home-project></home-project>'
                });
        }])
})();