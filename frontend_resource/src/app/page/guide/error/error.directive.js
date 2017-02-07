(function() {
    /* 引导页安装错误页面指令 */
    angular.module('eolinker').directive('error', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/guide/error/error.html',
            // replace:true,
            controller: errorCtroller,
            controllerAs: 'errorCtrl'
        }
    }])

    errorCtroller.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', 'md5', '$cookies', '$uibModal', '$window', '$rootScope'];

    function errorCtroller($scope, $timeout, Api, $state, CODE, md5, $cookies, $uibModal, $window, $rootScope) {
        var vm = this;
        var code = CODE.SUCCESS;

        function init() {// 初始化页面
            if (window.localStorage['INSTALLINFO']) {
                vm.info = {}
                try {
                    var info = JSON.parse(window.localStorage['INSTALLINFO']);
                    vm.info.master = info.master;
                    vm.info.name = info.name;
                    vm.info.userName = info.userName;
                    vm.info.password = info.password;
                } catch (e) {
                    vm.info.master = '';
                    vm.info.name = '';
                    vm.info.userName = '';
                    vm.info.password = '';
                }
            }
            /*
             * 判断用户是否已安装
             * 若已安装则跳转首页
             */
            Api.Install.Config().$promise.then(function(data) {
                if (data.statusCode == code) {
                    $state.go('index');
                }
            });
        }
        init();
    }

})();
