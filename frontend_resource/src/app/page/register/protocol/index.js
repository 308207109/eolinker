(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('register.protocol', {
                    url: '/protocol',// url相对路径/protocol
                    auth:true,// 页面权限，值为true时在未登录状态可以显示页面，默认为false
                    template: '<register-protocol></register-protocol>'
                });
        }])
})();