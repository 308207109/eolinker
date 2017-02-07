(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.error', {
                    url: '/error', // url相对路径/error
                    template: '<error></error>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
})();