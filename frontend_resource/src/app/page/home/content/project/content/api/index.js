(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('home.project.api', {
                    url: '/api',// url相对路径/home/project/api
                    template: '<home-project-api></home-project-api>'
                });
        }])
})();