(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.api.trash', {
                    url: '/trash?projectID?groupID?',// url相对路径/project/api/trash
                    template: '<project-api-trash></project-api-trash>'
                });
        }])
})();