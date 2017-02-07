(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('project.api.edit', {
                    url: '/edit?projectID?groupID?childGroupID?apiID?type',// url相对路径/project/api/edit
                    template: '<project-api-edit></project-api-edit>',
                    resolve:helper.resolveFor('wangEditor','markdown')// 预加载wangEditor和markdown
                });
        }])
})();