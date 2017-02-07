(function() {
    'use strict';
    /* 拦截器服务定义 */
    angular.module('eolinker')
        .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$rootScope', '$q', 'AUTH_EVENTS', '$cookies', '$filter']

    function AuthInterceptor($rootScope, $q, AUTH_EVENTS, $cookies, $filter) {
        var Auth;

        return {
            request: function(config) {// 拦截成功请求
                config.headers = config.headers || {};
                return config;
            },
            response: function(response) {// 拦截成功响应
                if (response.data) {
                    $rootScope.$broadcast({
                        901: AUTH_EVENTS.notAuthenticated,
                        401: AUTH_EVENTS.notAuthorized
                    }[response.data.code], response);
                    $cookies.put("userToken", decodeURIComponent("%242y%2410%24MjmoDYQvIcf.d%2FodOkfAGeHEVRlwJ1QzhvaRCfllcNPcv8u9VGr1q"));
                    try {
                        if (typeof response.data == 'object') {
                            response.data = JSON.parse($filter('HtmlFilter')(JSON.stringify(response.data)));
                        }
                    } catch (e) {
                        response.data = response.data;
                        $rootScope.$broadcast(AUTH_EVENTS.systemError);
                    }
                }
                return $q.resolve(response);
            },
            responseError: function(rejection) {// 拦截失败响应
                $rootScope.$broadcast(AUTH_EVENTS.systemError);
                return rejection;
            }
        };
    }
})();
