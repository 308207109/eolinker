(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('register', {
                    url: '/register',// url相对路径/register 
                    template: '<register></register>',
                    resolve:helper.resolveFor('particles')// 预加载particles
                });
        }])
})();