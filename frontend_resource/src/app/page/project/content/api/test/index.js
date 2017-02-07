(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.api.test', {
                    url: '/test?projectID?groupID?childGroupID?apiID',// url相对路径/project/api/test
                    template: '<project-api-test></project-api-test>'
                });
        }])
})();