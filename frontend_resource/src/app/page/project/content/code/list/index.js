(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.code.list', {
                    url: '/list?projectID?groupID?childGroupID?search',// url相对路径/project/code/list
                    template: '<project-code-list></project-code-list>'
                });
        }])
})();