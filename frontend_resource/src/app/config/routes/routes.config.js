/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('eolinker')
        /* 路由基础配置 */
        .config(routesConfig)
        .run(routesRun);

    routesConfig.$inject = ['$stateProvider', '$httpProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

    function routesConfig($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider, helper) {

        $httpProvider.interceptors.push([
            '$injector',
            function($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
        //$locationProvider.html5Mode(true);
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/index');
    }

    routesRun.$inject = ['$rootScope', '$state', 'AUTH_EVENTS','Api','USER_ROLES'];

    function routesRun($rootScope, $state, AUTH_EVENTS,Api,USER_ROLES) {
        $rootScope.user={};
        $rootScope.$on('$stateChangeSuccess',function(event, current){
            if (current && (current.$$route || current).redirectTo) {
                return;
            }
            if(!!current.title){
                window.document.title = current.title+' - '+$rootScope.user.title;
            }
            else{
                window.document.title = $rootScope.user.title;
            }
        })
    }
})();