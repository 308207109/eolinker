(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.second_step', {
                    url: '/second_step',//url相对路径/second_step
                    template: '<second></second>',
                    auth: true //页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
})();