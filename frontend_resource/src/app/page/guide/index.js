(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide', {
                    url: '/guide',// url相对路径/guide
                    template: '<guide></guide>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
})();