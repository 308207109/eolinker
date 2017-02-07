(function() {
    'use strict';
    angular.module('eolinker') 
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('index', {
                    url: '/index', // url相对路径/index
                    template: '<index></index>',
                    auth:true, // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                    resolve:helper.resolveFor('particles') // 预加载particles 
                });
        }])
})();
