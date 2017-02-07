(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.api.detail', {
                    url: '/detail?projectID?groupID?childGroupID?apiID',// url相对路径/project/api/detail
                    template: '<project-api-detail></project-api-detail>'
                });
        }])
})();