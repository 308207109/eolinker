(function() {
    'use strict';

    angular.module('eolinker', [
        //thrid part
        'ui.router',
        'oc.lazyLoad',
        'ngResource',
        'angular-md5',
        'ngCookies',
        //custom part
        'eolinker.filter',
        'eolinker.directive',
        'eolinker.service'
    ])

    .config(AppConfig)

    .run(AppRun);


    AppConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$logProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'isDebug'];

    // eolinker APP配置函数
    function AppConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $logProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, IsDebug) {

        // 修改post请求头部信息
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        var param = function(obj) {// 修改数据格式
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];


        // Enable log
        $logProvider.debugEnabled(IsDebug);
        $urlRouterProvider.otherwise('/index');

    }

    AppRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', '$templateCache', 'Api', 'AUTH_EVENTS','$http'];

    //eolinker APP运行函数
    function AppRun($rootScope, $state, $stateParams, $window, $templateCache, Api, AUTH_EVENTS,$http) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
})();