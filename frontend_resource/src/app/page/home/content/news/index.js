(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('home.news', {
                    url: '/news',// url相对路径/home/news
                    template: '<home-news></home-news>'
                });
        }])
})();