(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.api.list', {
                    url: '/list?projectID?groupID?childGroupID?search',// url相对路径/project/api/list
                    template: '<project-api-list></project-api-list>'
                });
        }])
})();