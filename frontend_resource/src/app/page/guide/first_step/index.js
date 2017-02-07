(function() {
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.first_step', {
                    url: '/first_step',/*url相对路径/first_step*/ 
                    template: '<first></first>',
                    auth: true /*页面权限，值为true时在未登录状态可以显示页面，默认为false*/
                });
        }])
})();