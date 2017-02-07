(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project', {
                    url: '/project',// url相对路径/project
                    template: '<project></project>',
                    resolve:helper.resolveFor('clipboard')
                });
        }])
})();