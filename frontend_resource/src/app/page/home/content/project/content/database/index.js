(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('home.project.database', {
                    url: '/database',// url相对路径/home/project/database
                    template: '<home-project-database></home-project-database>'
                });
        }])
})();