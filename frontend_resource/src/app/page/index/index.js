(function() {
    'use strict';
    angular.module('eolinker') 
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('index', {
                    url: '/index', // url相对路径/index
                    template: '<index></index>',
                    resolve:helper.resolveFor('particles'), // 预加载particles 
                    title:false
                });
        }])
})();
