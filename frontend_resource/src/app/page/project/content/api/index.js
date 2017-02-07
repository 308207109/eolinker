(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.api', {
                    url: '/api',// url相对路径/project/api
                    template: '<project-api></project-api>'
                });
        }])
})();