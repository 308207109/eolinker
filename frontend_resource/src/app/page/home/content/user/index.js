(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('home.user', {
                    url: '/user',// url相对路径/home/user
                    template: '<home-user></home-user>',
                    title:'账号管理'
                });
        }])
})();