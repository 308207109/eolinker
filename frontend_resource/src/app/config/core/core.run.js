(function() {
    'use strict';

    angular
        .module('eolinker')
        /* eolinker模块全局事件 */
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', 'Api', '$templateCache', 'AUTH_EVENTS', 'USER_ROLES', '$cookies', 'CODE', '$uibModal'];

    function appRun($rootScope, $state, $stateParams, $timeout, Api, $templateCache, AUTH_EVENTS, USER_ROLES, $cookies, CODE, $uibModal) {

        var ErrorModel = function openModel(title, info, callback) {
            // 弹窗引用
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ErrorModel',
                controller: 'ErrorModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }

        $rootScope.$on('$stateChangeStart', function(event, toState) {// 路由状态开始改变时触发
            if (!toState.auth) {// 判断页面权限
                Api.Logintype.Check().$promise.then(function(data) {
                    if (data.statusCode == CODE.UNAUTH) {

                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

                    } else if (data.type != USER_ROLES.USER) {

                        // user not login in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    }
                })
            }
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(data) {// 用户无权限时跳转首页
            $state.go('index');
            //$cookies.remove('userToken') ;
            //window.localStorage.clear();
        })

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function(data) {// 用户未登录时跳转首页
            $state.go('index');
            //$cookies.remove('userToken') ;
            //window.localStorage.clear();
        })

        $rootScope.$on(AUTH_EVENTS.systemError, function(data, attr) {// 发生系统错误时弹窗提示
            ErrorModel('错误提示', attr, function(data) {});
            //console.log('error')
            //$cookies.remove('userToken') ;
            //window.localStorage.clear();
        })

        $rootScope.$on('$numChange',function(obj,data){// 广播api/code数量变化
            switch(data){
                case 0:{
                    $rootScope.$broadcast('$numAdd');
                    break;
                }
                case 1:{
                    $rootScope.$broadcast('$numReduce');
                    break;
                }

            }
        })
    }

})();
