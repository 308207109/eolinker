(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.code', {
                    url: '/code',// url相对路径/project/code
                    template: '<project-code></project-code>'
                });
        }])
})();