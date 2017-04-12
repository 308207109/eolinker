(function() {
    /* 引导页第二步指令 */
    angular.module('eolinker').directive('second', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/guide/second_step/second_step.html',
            // replace:true,
            controller: secondCtroller,
            controllerAs: 'secondCtrl'
        }
    }])

    secondCtroller.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', 'md5', '$cookies', '$uibModal', '$window', '$rootScope'];

    function secondCtroller($scope, $timeout, Api, $state, CODE, md5, $cookies, $uibModal, $window, $rootScope) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.submited=false;

        function init() {// 初始化页面
            vm.info = {};
            /*
             * 判断用户是否已安装
             * 若已安装则跳转首页
             */
            Api.Install.Config().$promise.then(function(data) {
                if (data.statusCode == code) {
                    $state.go('index');
                }
            });

            if (window.localStorage['INSTALLINFO']) {
                try {
                    var info = JSON.parse(window.localStorage['INSTALLINFO']);
                    vm.info.dbURL = info.master;
                    vm.info.dbName = info.name;
                    vm.info.dbUser = info.userName;
                    vm.info.dbPassword = info.password;
                    vm.info.pageTitle = info.pageTitle;
                } catch (e) {
                    vm.info.dbURL = 'localhost';
                    vm.info.dbName = 'eolinker_os';
                    vm.info.dbUser = '';
                    vm.info.dbPassword = '';
                    vm.info.pageTitle = 'eolinker开源版';
                }
            } else {
                vm.info.dbURL = 'localhost';
                vm.info.dbName = 'eolinker_os';
                vm.info.dbUser = '';
                vm.info.dbPassword = '';
                vm.info.pageTitle = 'eolinker开源版';
            }
        }
        init();

        vm.enterThird = function() {// 跳转安装第三步
            if ($scope.secondForm.$valid) {
                var userInfo = {
                    master: vm.info.dbURL,
                    name: vm.info.dbName,
                    userName: vm.info.dbUser,
                    password: vm.info.dbPassword,
                    pageTitle:vm.info.pageTitle
                }
                window.localStorage.setItem('INSTALLINFO', JSON.stringify(userInfo));
                $state.go('guide.third_step');
            }
            else{
                vm.submited=true;
            }
        }
    }

})();
